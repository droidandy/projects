import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CountyEntity } from "./county.entity";
import { NeighborhoodEntity } from "./neighborhood.entity";
import { StateEntity } from "./state.entity";

@Entity("city")
export class CityEntity {
    constructor(id: number = null) {
        this.id = id;
    }
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(t => StateEntity)
    @JoinColumn()
    state?: StateEntity;

    @ManyToOne(t => CountyEntity, e => e.cities)
    @JoinColumn()
    county?: CountyEntity;

    @Column()
    @Index("IX_city_code")
    code?: string;

    @Column()
    name?: string;

    @OneToMany(t => NeighborhoodEntity, e => e.city)
    neighborhoods?: NeighborhoodEntity[];
}
