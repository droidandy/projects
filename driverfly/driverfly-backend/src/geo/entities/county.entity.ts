import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CityEntity } from "./city.entity";
import { StateEntity } from "./state.entity";

@Entity("county")
export class CountyEntity {
    constructor(id: number = null) {
        this.id = id;
    }
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(t => StateEntity, e => e.counties)
    @JoinColumn()
    state?: StateEntity;

    @Column()
    @Index("IX_county_code")
    code?: string;

    @Column()
    name?: string;

    @OneToMany(t => CityEntity, e => e.county)
    @JoinColumn()
    cities?: CityEntity[];
}
