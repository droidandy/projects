/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable,
} from 'typeorm';
import { Instrument } from './instrument';

@ObjectType()
@Entity({ name: 'theme', schema: 'launchpad' })
export class Theme extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field()
  @Column({ name: 'name' })
  public name: string;

  @Field((type) => [Instrument])
  @ManyToMany(() => Instrument, (instrument) => instrument.themes)
  @JoinTable({ name: 'theme_inst', joinColumn: { name: 'theme_id', referencedColumnName: 'id' }, schema: 'launchpad' })
  public instruments: Instrument[];

  // if filled, used to pass info on userId from parent to children nodes, used in UserIdPropagator middleware
  public userId: BigInt;
}
