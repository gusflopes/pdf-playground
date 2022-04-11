import { Parser, TransactionTypes } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  name: string;
  @IsEnum(Parser)
  parser: string;
  @IsEnum(TransactionTypes)
  transaction_type: string;
}
