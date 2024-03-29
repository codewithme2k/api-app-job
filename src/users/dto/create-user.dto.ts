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
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name Không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email khong dung dinh dang' })
  @IsNotEmpty({ message: 'Email Không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password Không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'age Không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'gender Không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'address Không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'role Không được để trống' })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  address: string;
  role: string;
}
