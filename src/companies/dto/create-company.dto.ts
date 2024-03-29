import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';

class Company {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  name: string;
}
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name Không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'address Không được để trống' })
  address: string;
  @IsNotEmpty({ message: 'description Không được để trống' })
  description: string;
}
