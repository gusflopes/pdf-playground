import { Injectable, Param } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import './string.extensions';
import './batches.types';
import { DateTime } from 'luxon';
import { PrismaService } from 'nestjs-prisma';
import { Batch, Receipt } from '@prisma/client';

const parserExample: PdfParser = {
  name: 'P_341_PIX', // 'P_COMPROVANTE_ITAU_PIX',
  description: 'Comprovante de Pagamento de PIX do Itaú',
  // fields: ['date', 'amount', 'name', 'cpfCnpj'],
  parameters: [
    {
      field: 'date',
      regexMethod: false,
      firstIndex: 'data da transferência:',
      secondIndex: / tipo de pagamento:/gm,
    },
    {
      field: 'amount',
      regexMethod: false,
      firstIndex: 'valor:',
      secondIndex: / data da transferência:/gm,
    },
    {
      field: 'name',
      regexMethod: false,
      firstIndex: 'nome do recebedor:',
      secondIndex: /( chave:)|( CPF \/ CNPJ do recebedor)/m,
    },
    {
      field: 'cpfCnpj',
      regexMethod: false,
      firstIndex: 'CPF / CNPJ do recebedor:',
      secondIndex: / instituição:/gm,
    },
    {
      field: 'pix',
      regexMethod: false,
      firstIndex: 'chave:',
      secondIndex: / CPF \/ CNPJ do recebedor:/gm,
      // secondIndex: /\d{11}/gm,
    },
  ],
};

const parsers = [parserExample];

interface IBatchesService {
  handle: (dto: IBatchServiceInput) => Promise<any>;
}
interface IBatchServiceData extends CreateBatchDto {
  account_id: string;
}

interface IBatchServiceInput {
  files: Array<Express.Multer.File>;
  data: IBatchServiceData;
  scope: string;
  raw?: boolean;
}

interface ITransaction {
  date: string;
  amount: string;
  name: string;
  cpfCnpj?: string;
  pix?: string;
  raw?: string;
}

interface IReceiptService {
  batch_id: string;
  account_id: string;
  amount: string;
  cpf_cnpj: string;
  date: string;
  payee: string;
  pix: string;
  raw: string;
  file: Express.Multer.File;
}

@Injectable()
export class BatchesService implements IBatchesService {
  constructor(private prisma: PrismaService) {}

  private pdf = require('pdf-parse');

  async index(accountId: string) {
    return await this.prisma.batch.findMany({
      orderBy: {
        created_at: 'desc',
      },
      where: {
        account_id: accountId,
      },
      include: {
        _count: true,
        // receipts: { select: { account_id: true } },
      },
    });
  }

  async createReceipt(data: IReceiptService) {
    const receipt = await this.prisma.receipt.create({
      data: {
        account: { connect: { id: data.account_id } },
        batch: { connect: { id: data.batch_id } },
        // account_id: account.id,
        amount: data.amount,
        cpf_cnpj: data.cpf_cnpj,
        // date: DateTime.fromISO(data.date, { locale: 'pt-BR' }).toISODate(),
        date: data.date,
        payee: data.payee,
        pix: data.pix ? data.pix : null,
        raw: data.raw ? data.raw : null,
        file: {
          create: {
            batch_id: data.batch_id,
            account_id: data.account_id,
            file: data.file.originalname,
            ext: 'pdf',
            path: 'not_implemented',
          },
        },
      },
    });
    return receipt;
  }

  async handle(input: IBatchServiceInput) {
    const { files, data, scope, raw } = input;

    const newBatch = await this.prisma.batch.create({
      data: {
        account: {
          connect: { id: data.account_id },
        },
        name: data.name,
        parser: data.parser,
        transaction_type: data.transaction_type,
      },
    });

    const response = await Promise.all(
      files.map(async (f) => {
        // console.log(f.originalname);

        // #1 interpretar arquivo
        const transaction = await this.readFile(f, data.parser, raw);

        // #2 Salvar o arquivo
        // todo ...

        // #3 Salvar o comprovante no banco de dados
        // Todo: salvar tb o arquivo no banco de dados
        console.log('file: ', f);
        const receipt = await this.createReceipt({
          account_id: newBatch.account_id,
          batch_id: newBatch.id,
          amount: transaction.amount.replace(/[R$. ]+/gm, '').replace(',', '.'),
          cpf_cnpj: transaction.cpfCnpj,
          // date: DateTime.fromISO(transaction.date).toFormat('dd-MM-yyyy'),
          date: transaction.date,
          payee: transaction.name,
          pix: transaction.pix,
          raw: transaction.raw,
          file: f,
        });

        return receipt;
      }),
    );

    // resposta: falta incluir dados do arquivo
    return {
      newBatch: {
        ...newBatch,
        receipts: response,
      },
    };

    // const receipts = await Promise.all(
    //   response.map(async (r) => {
    //     return await this.createReceipt({
    //       account_id: newBatch.account_id,
    //       batch_id: newBatch.id,
    //       amount: r.amount.replace(/[R$. ]+/gm, '').replace(',', '.'),
    //       cpf_cnpj: r.cpfCnpj,
    //       // date: DateTime.fromISO(r.date).toFormat('dd-MM-yyyy'),
    //       date: r.date,
    //       payee: r.name,
    //       pix: r.pix,
    //       raw: r.raw,
    //     });
    //   }),
    // );

    // return receipts;
    // const newData = await this.prisma.batch.create({
    //   data: {
    //     name: input.data.name,
    //     account_id: input.data.account_id,
    //     transaction_type: input.data.transaction_type,
    //     parser: input.data.parser,
    //     receipts: {
    //       createMany: { data: [response] },
    //     },
    //   },
    // });

    // return response;
  }

  async readFile(
    file: Express.Multer.File,
    parser: string,
    raw = false,
  ): Promise<ITransaction> {
    const firstStep = await this.readPdf(file);
    const secondStep = await this.cleanPdfString(firstStep);

    const selectedParser = parsers.find((p) => p.name === parser);
    console.log(selectedParser.name);
    if (!selectedParser) return;

    const parameters: Parser = selectedParser.parameters;
    const thirdStep = await this.finalParser(secondStep, parameters);

    return {
      ...thirdStep,
      cpfCnpj: thirdStep.cpfCnpj
        ? await this.formatCpfCnpj(thirdStep.cpfCnpj)
        : null,
      raw: raw ? secondStep : undefined,
    };
  }

  private async readPdf(file: Express.Multer.File) {
    // Read PDF file with 'pdf-parse' lib
    // max:1 => Read first page only
    const data: PdfFileProperties = await this.pdf(file.buffer, { max: 1 });
    // console.log(data);
    const dataJSON = JSON.stringify(data.text);
    return dataJSON;
  }

  private async cleanPdfString(pdfString: string) {
    return pdfString
      .split('\\n')
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s[.]/g, '.');
  }

  private regexParser(regex: RegExp, data: string) {
    const output = data.match(regex)[0];
    return output;
  }

  private async stringParser(
    firstIndex: string,
    secondIndex: RegExp,
    data: string,
  ) {
    const startString = data.regexIndexOf(firstIndex, 1) + firstIndex.length;
    // console.log('startString', startString);
    // console.log('firstIndex.lenght', firstIndex.length);
    // Não localizado
    if (startString === firstIndex.length - 1) {
      return null;
    }

    const endString = data.regexIndexOf(secondIndex, 0);
    // console.log('endString', endString);

    const output = data.substring(startString, endString);
    // console.log('output', output);
    return output;
  }

  private async customParser(string: string, parameters: Parser) {
    const resultPromises = Promise.all(
      parameters.map(async (p: ParserParameter) => {
        if (p.regexMethod) {
          return this.regexParser(p.secondIndex, string);
        } else {
          return await this.stringParser(p.firstIndex, p.secondIndex, string);
        }
      }),
    ).then((resultPromises) => {
      return resultPromises;
    });
    return resultPromises;
  }

  private async finalParser(cleanPdfString: string, parameters: Parser) {
    const pdfParsed = await this.customParser(cleanPdfString, parameters);

    console.log('Extracted data in Array format: ', pdfParsed);
    const resultObj = {} as ITransaction;
    let index = 0;
    for (const obj of parameters) {
      // const objValues = Object.values(obj);
      resultObj[obj.field] = pdfParsed[index];
      index++;
    }
    console.log('Extracted data in Object format: ', resultObj);

    return resultObj;
  }

  private async validateCnpj(cnpj: string) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj == '00000000000000' ||
      cnpj == '11111111111111' ||
      cnpj == '22222222222222' ||
      cnpj == '33333333333333' ||
      cnpj == '44444444444444' ||
      cnpj == '55555555555555' ||
      cnpj == '66666666666666' ||
      cnpj == '77777777777777' ||
      cnpj == '88888888888888' ||
      cnpj == '99999999999999'
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros: any = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado: number = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != Number(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != Number(digitos.charAt(1))) return false;

    return true;
  }

  private async formatCpfCnpj(i: string) {
    const data = i.replace(/[^\d]/g, '');

    if (data.length === 11) {
      return data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    const validCnpj = await this.validateCnpj(data);
    if (data.length === 14 && !validCnpj) {
      return data.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d{2})/, '$2.$3.$4-$5');
    }
    if (data.length === 14) {
      return data.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }
    return data;
  }
}
