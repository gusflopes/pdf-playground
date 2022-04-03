import { IsEnum, IsString } from 'class-validator';

enum AvailableParsers {
  'P_COMPROVANTE_ITAU_PIX',
}

export class PdfParserDto {
  @IsString()
  @IsEnum(AvailableParsers)
  parser: string;

  @IsString()
  bank: string;
  @IsString()
  account: string;
}
