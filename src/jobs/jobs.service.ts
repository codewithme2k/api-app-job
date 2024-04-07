import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    console.log(createJobDto);
    const {
      name,
      skills,
      company,
      salary,
      quantity,
      level,
      location,
      description,
      startDate,
      endDate,
      isActive,
    } = createJobDto;
    const newJob = await this.jobModel.create({
      name,
      skills,
      company,
      salary,
      quantity,
      level,
      location,
      description,
      startDate,
      endDate,
      isActive,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newJob._id,
      createdAt: newJob.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * +limit;
    const defaulLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaulLimit);

    const result = await this.jobModel
      .find(filter)
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job';
    return this.jobModel.findOne({ _id: id });
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job';
    const updated = await this.jobModel.updateOne(
      { id },
      {
        ...updateJobDto,
        UpdatedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job';
    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );
    return this.jobModel.softDelete({ _id: id });
  }
}
