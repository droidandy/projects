import { EntityRepository, Repository } from "typeorm";
import { CityEntity } from "../entities";

@EntityRepository(CityEntity)
export class CityRepository extends Repository<CityEntity> {}
