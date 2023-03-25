import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CompanyEntity } from '../../user/entities/company.entity';
import { DocumentEntity } from '../../documents/entities/documents.entity';

@Entity('vehicle')
export class VehicleEntity {
  constructor(id: number = null) {
    this.id = id;
  }
  @PrimaryGeneratedColumn()
  id?: number;

  @VersionColumn()
  version?: number;

  @ManyToOne((_) => CompanyEntity)
  @JoinColumn()
  company?: CompanyEntity;

  @Column()
  type?: string;

  // used when type = OTHER
  @Column({ nullable: true })
  type_other?: string;

  @Column({ nullable: true })
  trailer_type?: string;

  @Column({ nullable: true })
  trailer_type_other?: string;

  @Column({ nullable: true })
  transmission_type?: string;

  @Column({ nullable: true })
  make?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  year?: number;

  @ManyToOne((_) => DocumentEntity, { eager: true, nullable: true })
  @JoinColumn()
  photo?: DocumentEntity;

  @Column({ type: 'simple-array', nullable: true })
  accessories?: string[];

  @Column({ nullable: true })
  accessory_other?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  last_updated_at?: Date;
}
