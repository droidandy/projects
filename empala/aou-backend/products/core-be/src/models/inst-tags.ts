/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne,
} from 'typeorm';
import { Instrument } from './instrument';
import { Theme } from './theme';
import { User } from './user';

@ObjectType()
@Entity({ name: 'tag', schema: 'launchpad' })
export class Tags extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Column({ name: 'theme_id', type: 'bigint' })
  public themeId: string;

  @Field((type) => [Theme])
  public themes: Theme[];

  @Column({ name: 'inst_id', type: 'bigint' })
  public instId: string;

  @Field((type) => Instrument)
  public instrument: Instrument;

  @Column({ name: 'user_id', type: 'bigint' })
  public userId: string;

  @ManyToOne((type) => User, (user) => user.tags)
  public user: User;
}

@ObjectType()
export class InstTags {
  @Field((type) => [ID])
  public ids: BigInt[];

  @Field((type) => [Theme])
  public themes: Theme[];

  @Field((type) => Instrument)
  public instrument: Instrument;
}
