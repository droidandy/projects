import { EntityRepository, Repository } from 'typeorm';
import { DocumentEntity } from '../entities/documents.entity';

@EntityRepository(DocumentEntity)
export class DocumentRepository extends Repository<DocumentEntity> {
  async saveRecord(): Promise<DocumentEntity> {
    console.log('hello');

    return new DocumentEntity();
  }
}
