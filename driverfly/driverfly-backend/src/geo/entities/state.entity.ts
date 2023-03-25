import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CityEntity } from "./city.entity";
import { CountyEntity } from "./county.entity";
import { NeighborhoodEntity } from "./neighborhood.entity";

@Entity("state")
export class StateEntity {
    constructor(id: number = null) {
        this.id = id;
    }
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @Index("IX_state_code")
    code?: string;

    @Column()
    short_code?: string;

    @Column()
    name?: string;

    @OneToMany(t => CountyEntity, e => e.state)
    counties?: CountyEntity[];

    @OneToMany(t => CityEntity, e => e.state)
    cities?: CityEntity[];

    @OneToMany(t => NeighborhoodEntity, e => e.state)
    neighborhoods?: NeighborhoodEntity[];
}
