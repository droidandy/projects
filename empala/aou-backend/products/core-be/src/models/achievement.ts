/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Field, ID, Int, ObjectType,
} from 'type-graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable,
} from 'typeorm';
import { User } from './user';

@ObjectType()
@Entity({ name: 'achievement', schema: 'launchpad' })
export class Achievement extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field()
  @Column({ name: 'name' })
  public name: string;

  @Field((type) => Int)
  @Column({ name: 'level', type: 'bigint' })
  public level: number;

  @Field()
  @Column({ name: 'icon' })
  public icon: string;

  @ManyToMany(() => User, (user) => user.achievements)
  public user: User;
}
