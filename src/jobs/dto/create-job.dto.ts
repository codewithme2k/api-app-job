import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class Company {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  salary: number;
  @IsNotEmpty()
  location: string;
  @IsNotEmpty()
  quantity: number;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsArray({ message: 'skill co dinh dang la array' })
  @IsString({ each: true, message: 'skill khong dinh dang la string' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startdate khobg dubg dinh dang' })
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'enddate khobg dubg dinh dang' })
  endDate: Date;
  @IsBoolean()
  isActive: boolean;
}
