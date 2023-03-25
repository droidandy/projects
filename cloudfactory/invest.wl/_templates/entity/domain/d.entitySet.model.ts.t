---
to: src/domain/<%= Name %>/model/D.<%= Name %>Set.model.ts
---
import { Injectable } from '../../../common/IoC';
import { DomainValueBase } from '../../Domain.model';
import { IDomainValueBase } from '../../Domain.types';
import { ID<%= Name %>SetRequestDTO } from '../dto';

export const D<%= Name %>SetModelTid = Symbol.for('D<%= Name %>SetModelTid');
type TDTO = ID<%= Name %>SetRequestDTO;

export interface ID<%= Name %>SetModel<DTO extends TDTO = TDTO> extends IDomainValueBase<DTO> {}

@Injectable()
export class D<%= Name %>SetModel<DTO extends TDTO = TDTO> extends DomainValueBase<DTO> implements ID<%= Name %>SetModel<DTO> {

}
