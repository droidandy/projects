import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CompanyController } from './controllers/company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { SubscriptionEntity } from './entities/subscriptions.entity';
import { UserRepository } from './repositories/user.repository';
import { UserDeviceTokenEntity } from './entities/user-device-token.entity';
import { CompanyService } from './services/company.service';
import { CompanyRepository } from './repositories/company.repository';
import { JobsModule } from '../jobs/jobs.module';
import { DocumentsModule } from '../documents/documents.module';
import DocumentUploadService from '../documents/classes/document-upload.service';
import { DocumentEntity } from '../documents/entities/documents.entity';
import { DocumentRepository } from '../documents/repositories/document.repository';

@Module({
  imports: [
    JobsModule,
    DocumentsModule,
    TypeOrmModule.forFeature([
      UserEntity,
      SubscriptionEntity,
      UserRepository,
      UserDeviceTokenEntity,
      CompanyRepository,
      DocumentEntity,
      DocumentRepository,
    ]),
  ],
  providers: [
    UserService,
    CompanyService,
    DocumentUploadService,
    // {
    //     provide: APP_GUARD,
    //     useClass: RolesGuard,
    // },
  ],
  controllers: [UserController, CompanyController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
