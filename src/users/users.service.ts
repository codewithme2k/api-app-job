import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email: email });
    return !user;
  }
  async create(createUserDto: CreateUserDto, user: IUser) {
    const isUnique = await this.isEmailUnique(createUserDto.email);
    //console.log(isUnique);
    if (!isUnique) {
      throw new BadRequestException('Email already exists.');
    }
    console.log(user);
    const hashPassword = this.getHashPassword(createUserDto.password);
    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return createdUser.save();
  }
  async register(user: RegisterUserDto) {
    const { name, email, password, gender, age, address } = user;
    const isUnique = await this.isEmailUnique(email);
    //console.log(isUnique);
    if (!isUnique) {
      throw new BadRequestException('Email already exists.');
    }
    const hashPassword = this.getHashPassword(password);
    const newRegister = await this.userModel.create({
      name,
      email,
      gender,
      age,
      address,
      password: hashPassword,
      role: 'user',
    });
    return newRegister.save();
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const offset = (currentPage - 1) * +limit;
    const defaulLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaulLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaulLimit)
      .sort(sort as any)
      .select('-password')
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.findOne({ _id: id }).select('-password').exec();
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const userUpdate = await this.userModel.findById(id).exec();
    if (!userUpdate) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.password) {
      // If updating password, hash the new password
      updateUserDto.password = await this.getHashPassword(
        updateUserDto.password,
      );
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        UpdatedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );
    return { _id: id, ...updateUserDto };
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.softDelete({ _id: id });
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };
  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
