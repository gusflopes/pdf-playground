import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { DateTime } from 'luxon';

@Entity({ tableName: 'accounts' })
export class Account {
  @PrimaryKey({ autoincrement: true }) id: number;

  @Property() name: string;
  @Property({ nullable: true }) code?: string;
  @Property({ type: 'boolean' }) isBank = false;
}

// enum AccountType {
//   'CORRENTE',
//   'POUPANÇA',
// }

// export class CreateAccountDto {
//   @IsString()
//   name: string;
//   @IsNumber()
//   openBalance: number;
//   @IsDateString()
//   openDate: DateTime;
//   @IsBoolean()
//   @IsOptional()
//   isBank?: boolean;
