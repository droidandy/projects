import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CityEntity, CountyEntity, StateEntity } from ".";
import { NeighborhoodEntity } from "./neighborhood.entity";

@Entity("forward_geocode")
export class ForwardGeocodeEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @Index("IX_forward_geocode_hash")
    hash: string;

    @Column()
    type?: string;

    @Column()
    address: string;

    @Column()
    relevance: number;

    @Column({ type: "double" })
    latitude: number;

    @Column({ type: "double" })
    longitude: number;

    @Column()
    street: string;

    @Column({ nullable: true })
    street2: string;

    @ManyToOne(t => NeighborhoodEntity, { nullable: true, eager: true })
    @JoinColumn()
    neighborhood?: NeighborhoodEntity;
    @ManyToOne(t => CityEntity, { nullable: true, eager: true })
    @JoinColumn()
    city: CityEntity;
    @ManyToOne(t => CountyEntity, { nullable: true, eager: true })
    @JoinColumn()
    county: CountyEntity;
    @ManyToOne(t => StateEntity, { nullable: true, eager: true })
    @JoinColumn()
    state: StateEntity;

    @Column()
    zip_code: string;

    @CreateDateColumn()
    created_at: Date;
}