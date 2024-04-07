import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { name, email, skills } = createSubscriberDto;
    const isExist = await this.subscriberModel.findOne({ email });
    if (!isExist) {
      throw new BadRequestException(`Email da ton tai tren he thong`);
    }
    let newSubs = await this.subscriberModel.create({
      name,
      email,
      skills,
      createBy: {
        id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newSubs?._id,
      createdBy: newSubs?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * +limit;
    const defaulLimit = +limit ? +limit : 10;
    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaulLimit);

    const result = await this.subscriberModel
      .find(filter)
      .skip(offset)
      .limit(defaulLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
      throw new BadRequestException('not found CV');
    }
    return this.subscriberModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
    user: IUser,
  ) {
    const updated = await this.subscriberModel.updateOne(
      { _id: id },
      {
        ...updateSubscriberDto,
        UpdatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.subscriberModel.softDelete({ _id: id });
  }
}
