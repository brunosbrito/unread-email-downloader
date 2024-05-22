import { IsString, IsInt } from 'class-validator';

export class EmailDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  host: string;

  @IsInt()
  port: number;
}
