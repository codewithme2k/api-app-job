import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private CompanyModel: SoftDeleteModel<CompanyDocument>,
  ) {}
  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.CompanyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        name: user.name,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * +limit;
    const defaulLimit = +limit ? +limit : 10;
    const totalItems = (await this.CompanyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaulLimit);

    const result = await this.CompanyModel.find(filter)
      .skip(offset)
      .limit(defaulLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        currentPage: currentPage,
        pageSize: limit,
        page: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found company id');
    }
    return this.CompanyModel.findOne({ _id: id });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.CompanyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        UpdatedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found Company';
    await this.CompanyModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );
    return this.CompanyModel.softDelete({ _id: id });
  }
}
