import { EntityRepository, Repository } from "typeorm";
import { ForwardGeocodeEntity } from "../entities";

@EntityRepository(ForwardGeocodeEntity)
export class ForwardGeocodeRepository extends Repository<ForwardGeocodeEntity> {}