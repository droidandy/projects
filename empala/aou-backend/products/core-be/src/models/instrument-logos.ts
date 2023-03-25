import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Instrument } from './instrument';

@ObjectType()
@Entity({ name: 'logos', schema: 'instruments' })
export class InstrumentLogos extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Column({ name: 'inst_id', type: 'bigint' })
  public instId: BigInt;

  @Field(() => Instrument)
  @OneToOne(() => Instrument, (instr) => instr.logos)
  @JoinColumn({ name: 'inst_id', referencedColumnName: 'id' })
  public instrument: Instrument;

  @Field({ nullable: true })
  @Column()
  public logo: string | null;

  @Field({ nullable: true })
  @Column({ name: 'logo_original' })
  public logoOriginal: string | null;

  @Field({ nullable: true })
  @Column({ name: 'logo_normal' })
  public logoNormal: string | null;

  @Field({ nullable: true })
  @Column({ name: 'logo_thumbnail' })
  public logoThumbnail: string | null;

  @Field({ nullable: true })
  @Column({ name: 'logo_square' })
  public logoSquare: string | null;

  @Field({ nullable: true })
  @Column({ name: 'logo_square_strict' })
  public logoSquareStrict: string | null;
}
