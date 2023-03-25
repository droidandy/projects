import { EntityRepository, Repository } from "typeorm";
import { CountyEntity } from "../entities";

@EntityRepository(CountyEntity)
export class CountyRepository extends Repository<CountyEntity> {}