import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Double,
} from 'typeorm';
import { CompanyEntity } from '../../user/entities/company.entity';

@Entity('location')
export class LocationEntity {
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
  street: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: true })
  forwardGeocodeId?: number;

  @Column({ nullable: true })
  countyId?: number;

  @Column({ nullable: true })
  neighborhoodId?: number;

  // calculated based on address lookup
  @Column({ type: 'double', nullable: true })
  latitude?: number;

  // calculated based on address lookup
  @Column({ type: 'double', nullable: true })
  longitude?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  last_updated_at?: Date;
}
