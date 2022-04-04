import { DateTime } from 'luxon';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
enum AccountType {
  'CORRENTE',
  'POUPANÇA',
}

export class CreateAccountDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  code?: string;
  // @IsNumber()
  // openBalance: number;
  // @IsDateString()
  // openDate: DateTime;
  @IsBoolean()
  @IsOptional()
  isBank?: boolean;

  // bank_details: {
  //   code?: string;
  //   bank_code?: string;
  //   bank_name?: string;
  //   branch?: string;
  //   number?: string;
  //   type?: AccountType;
  // };
}
