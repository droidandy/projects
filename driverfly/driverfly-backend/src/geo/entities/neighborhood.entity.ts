import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CountyEntity } from ".";
import { CityEntity } from "./city.entity";
import { StateEntity } from "./state.entity";

@Entity("neighborhood")
export class NeighborhoodEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(t => StateEntity)
    @JoinColumn()
    state?: StateEntity;

    @ManyToOne(t => CountyEntity)
    @JoinColumn()
    county?: CountyEntity;

    @ManyToOne(t => CityEntity, e => e.neighborhoods)
    @JoinColumn()
    city?: CityEntity;

    @Column()
    @Index("IX_neightborhood_code")
    code?: string;

    @Column()
    name?: string;
}
