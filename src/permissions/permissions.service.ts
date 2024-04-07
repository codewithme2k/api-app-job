import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ apiPath, method });
    if (isExist) {
      throw new BadRequestException(
        `Permissions voi apiPath=${apiPath} ,method=${method}`,
      );
    }
    const newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newPermission?._id,
      createdAt: newPermission.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * +limit;
    const defaulLimit = +limit ? +limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaulLimit);

    const result = await this.permissionModel
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not Permission id ');
    }
    return this.permissionModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not Permission id ');
    }
    const { name, apiPath, method, module } = updatePermissionDto;
    const updated = await this.permissionModel.updateOne(
      { _id: id },
      {
        name,
        apiPath,
        method,
        module,
        UpdatedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found permission';
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      },
    );
    return this.permissionModel.softDelete({ _id: id });
  }
}
