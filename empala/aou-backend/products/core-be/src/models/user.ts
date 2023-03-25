/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Field, ID, Int, ObjectType, Float,
} from 'type-graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn,
} from 'typeorm';
import { Tags, InstTags } from './inst-tags';
import { Stack } from './stack';
import { Hunch } from './hunch';
import { Achievement } from './achievement';
import { Portfolio } from './portfolio';

@ObjectType()
@Entity({ name: 'user', schema: 'launchpad' })
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field({ description: 'AOU-460 -> AOU-437' })
  @Column({ name: 'user_name' })
  public userName: string;

  @Column({ name: 'user_cognito_id' })
  public userCognitoId: string;

  @Field()
  @Column({ name: 'email' })
  public email: string;

  @Field({ description: 'AOU-460 -> AOU-437' })
  @Column({ name: 'full_name' })
  public fullName: string;

  @Field({ description: 'AOU-460 -> AOU-437' })
  @Column({ name: 'bio' })
  public bio: string;

  @Field({ description: 'AOU-460 -> AOU-437' })
  @Column({ name: 'avatar' })
  public avatar: string;

  @Field((type) => [Tags])
  public tags: Tags[];

  @Field((type) => [InstTags], { description: 'AOU-523 -> AOU-108' })
  public instTags: InstTags[];

  @Field((type) => [Stack], { description: 'AOU-521 -> AOU-58' })
  @OneToMany((type) => Stack, (stack) => stack.user)
  public stacks: Stack[];

  @Field((type) => [Hunch], { description: 'AOU-520 -> AOU-59' })
  @OneToMany((type) => Hunch, (hunch) => hunch.user)
  public hunches: Hunch[];

  @Field((type) => [Achievement], { description: 'AOU-451 -> AOU-83' })
  @ManyToMany(() => Achievement, (achievement) => achievement.user)
  @JoinTable({ name: 'userachievement', joinColumn: { name: 'user_id', referencedColumnName: 'id' }, schema: 'launchpad' })
  public achievements: Achievement[];

  @Field((type) => [Stack], { description: 'AOU-515 -> AOU-437' })
  public followedStacks: Stack[];

  @Field((type) => [Hunch], { description: 'AOU-463 -> AOU-437' })
  public followedHunches: Hunch[];

  @Field((type) => [User], { description: 'AOU-522 -> AOU-532, AOU-437, users given user follows' })
  public followedUsers: User[];

  @Field((type) => [User], { description: 'AOU-650 -> AOU-532, AOU-437, users that follow given user' })
  public followers: User[];

  @Field((type) => Int, { description: 'AOU-460 -> AOU-437' })
  public nHunches: number;

  @Field((type) => Int, { description: 'AOU-460 -> AOU-437' })
  public nStacks: number;

  @Field((type) => Int, { description: 'AOU-460 -> AOU-437, number of users following given user' })
  public nFollowers: number;

  @Field((type) => Int, { description: 'AOU-460 -> AOU-437, number of users given user follows' })
  public nFollowedUsers: number;

  @Field({ description: 'BETA' })
  public canTrade: boolean;

  @Field((type) => Float, { description: 'AOU-526 -> AOU-437' })
  public huncherPercentage: number;

  @Field((type) => Portfolio, { description: 'The summary of all positions including gains the user has in the market grouped by instrument' })
  public portfolio: Portfolio = new Portfolio();
}

@ObjectType()
@Entity({ name: 'userfollow', schema: 'launchpad' })
export class UserFollow extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field((type) => User)
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_followed_id', referencedColumnName: 'id' })
  public userFollowed: User;

  @Field((type) => User)
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_follower_id', referencedColumnName: 'id' })
  public follower: User;

  @Column({ type: 'bigint' })
  public userFollowerId: BigInt;

  @Column({ type: 'bigint' })
  public userFollowedId: BigInt;
}
