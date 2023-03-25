/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Field, ID, ObjectType, Float,
} from 'type-graphql';
import {
  Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable, JoinColumn,
} from 'typeorm';
import { Instrument } from './instrument';
import { User } from './user';

@ObjectType()
@Entity({ name: 'stack', schema: 'launchpad' })
export class Stack extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field()
  @Column({ name: 'name' })
  public name: string;

  @Field((type) => [Instrument])
  @ManyToMany(() => Instrument, (instrument) => instrument.stacks, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'stack_inst',
    joinColumn: {
      name: 'stack_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'inst_id',
      referencedColumnName: 'id',
    },
    schema: 'launchpad',
  })
  public instruments: Instrument[];

  @Column({ name: 'user_id', type: 'bigint' })
  public userId: BigInt;

  @ManyToOne(() => User, (user) => user.stacks, { cascade: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @Field((type) => Float, { nullable: true, description: 'AOU-528 -> AOU-58' })
  public totalValue: number;

  @Field((type) => Float, { nullable: true })
  public percentageChange: number;
}

@ObjectType()
@Entity({ name: 'stackfollow', schema: 'launchpad' })
export class StackFollow extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field((type) => User)
  public userFollowed: User;

  @Field((type) => User)
  public follower: User;
}
