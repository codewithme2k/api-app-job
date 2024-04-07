import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => {
    return process.cwd();
  };
  enSureExists(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          break;
        case 'ENOTDIR':
          break;
        default:
          break;
      }
    });
  }
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.enSureExists(`public/images/${folder}`);
          cb(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, cb) => {
          let extName = path.extname(file.originalname);
          let baseName = path.basename(file.originalname, extName);
          let finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
    };
  }
}
