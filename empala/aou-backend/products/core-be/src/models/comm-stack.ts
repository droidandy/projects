import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinTable, ManyToMany,
} from 'typeorm';
import { Instrument } from './instrument';

@ObjectType()
@Entity({ name: 'commstack', schema: 'launchpad' })
export class CommStack extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field()
  @Column()
  public name: string;

  @Field(() => [Instrument])
  @ManyToMany(() => Instrument)
  @JoinTable({
    name: 'commstack_inst',
    joinColumn: {
      name: 'commstack_id',
      referencedColumnName: 'id',
    },
    schema: 'launchpad',
  })
  public instruments: Instrument[];
}
