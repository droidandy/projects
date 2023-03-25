import { Injectable } from '@nestjs/common';
import fs = require('fs');
import { uuid } from 'uuidv4';
import { InjectS3, S3 } from 'nestjs-s3';
import path = require('path');
import { DocumentRepository } from '../repositories/document.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class DocumentUploadService {
  constructor(
    @InjectS3() private readonly s3: S3,
    @InjectRepository(DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) {}

  /**
   *
   * @param type
   * @param file
   * @returns
   */
  async uploadS3(type, file) {
    const fileType = file.mimetype.split('/')[1];
    console.log(file);

    const path = `documents/${uuid()}/${file.originalname}`;
    const data = await this.s3
      .upload({
        Bucket: 'driverfly-docs',
        Key: path as string,
        Body: file.buffer,
        ContentType: `${file.mimetype}`,
        ACL: 'public-read',
      })
      .promise();

    return data.Location;
  }

  /**
   *
   * @param userId
   * @param type
   * @returns
   */
  async getFiles(user, type) {
    return await this.documentRepository
      .createQueryBuilder('document')
      .where('document.userId = :userId', { userId: user.id })
      .orderBy('document.id', 'DESC')
      // .groupBy('document.type')
      .getMany();
  }

  /**
   *
   * @param userId
   * @param type
   * @returns
   */
  async deleteFile(user, type) {
    return await this.documentRepository
      .createQueryBuilder('document')
      .where('documents.userId = :userId', { userId: user.id })
      .where('documents.type = :type', { type })
      .delete()
      .execute();
  }
}
