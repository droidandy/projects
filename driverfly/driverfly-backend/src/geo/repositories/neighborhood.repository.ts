import { EntityRepository, Repository } from "typeorm";
import { NeighborhoodEntity } from "../entities";

@EntityRepository(NeighborhoodEntity)
export class NeighborhoodRepository extends Repository<NeighborhoodEntity> {}