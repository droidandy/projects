import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum DocumentType {
  RESUME = 'RESUME',
  MVR = 'MVR',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  MEDICAL_CARD = 'MEDICAL_CARD',
}

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  path: string;

  @Column({
    nullable: true,
  })
  type: string;

  @Column({
    nullable: true,
  })
  documentable_id: number;

  @Column({
    nullable: true,
  })
  documentable_type: string;

  // @Column()
  // owner_type: string;

  @ManyToOne((type) => UserEntity, (user) => user.documents)
  user: UserEntity;
}
