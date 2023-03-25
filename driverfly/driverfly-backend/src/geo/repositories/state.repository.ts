import { EntityRepository, Repository } from "typeorm";
import { StateEntity } from "../entities";

@EntityRepository(StateEntity)
export class StateRepository extends Repository<StateEntity> {}
