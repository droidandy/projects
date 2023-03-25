import { Injectable } from '@nestjs/common';
import fs = require('fs');
import { uuid } from 'uuidv4';

@Injectable()
export default class DocumentUploadService {
  /**
   *
   * @param type - type of file to upload
   * @param file
   */
  async upload(type, file) {
    const path = 'upload/documents/' + type + '/' + uuid() + '/';

    fs.mkdirSync(path, { recursive: true });

    fs.writeFileSync(path + file.originalname, file.buffer);
    return path + file.originalname;
  }
}
