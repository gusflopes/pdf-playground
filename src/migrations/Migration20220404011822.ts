import { Migration } from '@mikro-orm/migrations';

export class Migration20220404011822 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);');

    this.addSql('create table "accounts" ("id" serial primary key, "name" varchar(255) not null, "code" varchar(255) null, "is_bank" boolean not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "accounts" cascade;');
  }

}
