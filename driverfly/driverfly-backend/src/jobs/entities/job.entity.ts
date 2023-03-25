import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  VersionColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Double,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ApplicationEntity } from './applications.entity';
import { CompanyEntity } from '../../user/entities/company.entity';
import { LocationEntity } from '../../company/entities/location.entity';
import { VehicleEntity } from 'src/company/entities/vehicle.entity';
import { JobSkillEntity } from './jobSkills.entity';
import { JobMvrEntity } from './jobMvr.entity';
import { JobCriminalEntity } from './jobCriminal.entity';

@Entity('jobs')
export class JobEntity {
  constructor(id: number = null) {
    this.id = id;
  }
  @PrimaryGeneratedColumn()
  id?: number;

  @VersionColumn()
  version?: number;

  @ManyToOne((t) => CompanyEntity)
  @JoinColumn()
  company?: CompanyEntity;

  @ManyToOne((t) => LocationEntity, { eager: true })
  @JoinColumn()
  location?: LocationEntity;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  description_short?: string;

  @Column({ nullable: true })
  drivers_needed?: number;

  @Column({ type: 'timestamp', nullable: true })
  expiry_date?: Date;

  @Column({ nullable: true })
  geography?: string;

  @Column({ nullable: true })
  schedule?: string;

  @Column({ nullable: true })
  employment_type?: string;

  @Column({ nullable: true })
  equipment_type?: string;

  @Column({ nullable: true })
  delivery_type?: string;

  @Column({ nullable: true })
  team_drivers?: string;

  /// benefits
  @Column({ type: 'simple-array', nullable: true })
  pay_methods?: string[];

  @Column({ type: 'decimal', nullable: true })
  min_rate?: Double;

  @Column({ type: 'decimal', nullable: true })
  max_rate?: Double;

  @Column({ nullable: true })
  min_miles?: number;

  @Column({ nullable: true })
  max_miles?: number;

  @Column({ type: 'decimal', nullable: true })
  min_weekely_pay?: Double;

  @Column({ type: 'decimal', nullable: true })
  max_weekely_pay?: Double;

  @Column({ type: 'simple-array', nullable: true })
  benefits?: string[];

  @Column({ nullable: true })
  benefits_other?: string;

  @ManyToMany((t) => VehicleEntity)
  @JoinTable()
  vehicles?: VehicleEntity[];

  // requirements
  @Column({ type: 'simple-array', nullable: true })
  cdl_class?: string[];

  @Column({ nullable: true })
  min_years_experience?: number;

  @Column({ nullable: true })
  min_degree?: string;

  @OneToMany((t) => JobSkillEntity, (e) => e.job)
  required_skills?: JobSkillEntity[];

  @Column({ nullable: true })
  required_skills_other?: string;

  @Column({ type: 'simple-array', nullable: true })
  required_equipment?: string[];

  @Column({ type: 'simple-array', nullable: true })
  required_endorsement?: string[];

  @Column({ nullable: true })
  transmission_type_experience?: string;

  @Column({ nullable: true })
  max_applicant_radius?: number;

  @Column({ default: true })
  must_pass_drug_test?: boolean;

  @Column({ default: true })
  must_have_clean_mvr?: boolean;

  @OneToMany((t) => JobMvrEntity, (e) => e.job)
  mvr_requirements?: JobMvrEntity[];

  @Column({ default: false })
  accept_sap_graduates?: boolean;

  @OneToMany((t) => JobCriminalEntity, (e) => e.job)
  criminal_history?: JobCriminalEntity[];

  @Column({ default: 0 })
  max_accidents?: number;

  @Column({ nullable: true })
  safety_requirements_other?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  last_updated_at: Date;

  @OneToMany(() => ApplicationEntity, (application) => application.job)
  applications: ApplicationEntity[];
}
