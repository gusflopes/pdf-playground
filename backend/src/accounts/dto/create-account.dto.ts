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
  bank_code: string;
  @IsString()
  @IsOptional()
  branch?: string;
  @IsString()
  @IsOptional()
  number?: string;
}

// name      String
// bank_code String
// branch    String?
// number    String?
