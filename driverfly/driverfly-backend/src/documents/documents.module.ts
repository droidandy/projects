import { Module } from '@nestjs/common';
import DocumentUploadService from './classes/document-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/documents.entity';
import { DocumentRepository } from './repositories/document.repository';
import { S3Module } from 'nestjs-s3';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // UserModule,
    TypeOrmModule.forFeature([DocumentEntity, DocumentRepository, UserEntity]),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
          secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
          endpoint: configService.get<string>('AWS_ENDPOINT'),
          region: configService.get<string>('AWS_REGION'),
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
    }),
  ],
  providers: [DocumentUploadService],
  exports: [DocumentUploadService],
})
export class DocumentsModule {}
