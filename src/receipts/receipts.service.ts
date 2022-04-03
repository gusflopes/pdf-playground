import { Injectable } from '@nestjs/common';
import './string.extensions';
// import dtos
type PdfFileProperties = {
  numpages: number;
  numrender: number;
  info: {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    Producer: string;
    ModDate: string;
  };
  metadata: any;
  text: string;
  version: string;
};
type ParserParameter = {
  field: string;
  regexMethod: boolean;
  firstIndex: string | null;
  secondIndex: RegExp;
  formatFn?: (i: string) => Promise<string>;
};
type Parser = ParserParameter[];

@Injectable()
export class ReceiptsService {
  private pdf = require('pdf-parse');

  private async readPdf(file: Express.Multer.File) {
    const data: PdfFileProperties = await this.pdf(file.buffer);
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
    const startString =
      (await data.regexIndexOf(firstIndex, 1)) + firstIndex.length;
    // console.log('startString', startString);

    const endString = await data.regexIndexOf(secondIndex, 0);
    // console.log('endString', endString);

    const output = await data.substring(startString, endString);
    // console.log('output', output);
    return output;
  }

  private async callParser(input: string, parameter: ParserParameter) {
    if (parameter.regexMethod) {
      return this.regexParser(parameter.secondIndex, input);
    } else {
      return await this.stringParser(
        parameter.firstIndex,
        parameter.secondIndex,
        input,
      );
    }
  }

  private async customParser(string: string, parameters: Parser) {
    const resultPromises = Promise.all(
      parameters.map(async (p: ParserParameter) => {
        // await this.callParser(string, p);
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
    const resultObj = {} as any;
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

  async readFile(dto: any) {
    const firstStep = await this.readPdf(dto);
    const secondStep = await this.cleanPdfString(firstStep);
    // data | valor | favorecido | cpf/cnpj
    const parameters: Parser = [
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
        secondIndex: / CPF \/ CNPJ do recebedor/gm,
      },
      {
        field: 'cpfCnpj',
        regexMethod: false,
        firstIndex: 'CPF / CNPJ do recebedor:',
        secondIndex: / instituição:/gm,
        formatFn: this.formatCpfCnpj,
      },
    ];
    const thirdStep = await this.finalParser(secondStep, parameters);

    return {
      transaction: {
        ...thirdStep,
        cpfCnpj: thirdStep.cpfCnpj
          ? await this.formatCpfCnpj(thirdStep.cpfCnpj)
          : null,
      },
      raw: secondStep,
    };
  }
}
