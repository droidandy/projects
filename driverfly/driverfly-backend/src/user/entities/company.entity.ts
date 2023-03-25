import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('companies')
export class CompanyEntity {
  constructor(id?: number) {
    this.id = id;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  location: string;

  @OneToMany((type) => UserEntity, (user) => user.company)
  users: UserEntity[];
}
