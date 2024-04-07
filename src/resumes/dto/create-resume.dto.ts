import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  @IsMongoId()
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  jobId: mongoose.Schema.Types.ObjectId;
}
