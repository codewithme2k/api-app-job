import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name Không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'address Không được để trống' })
  address: string;
  @IsNotEmpty({ message: 'description Không được để trống' })
  description: string;
}
