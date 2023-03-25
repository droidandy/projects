---
to: src/domain/<%= Name %>/model/D.<%= Name %>.model.ts
---
import { Injectable } from '../../../common/IoC';
import { DomainModelBase } from '../../Domain.model';
import { IDomainModelBase } from '../../Domain.types';
import { ID<%= Name %>GetResponseDTO } from '../dto';

export const D<%= Name %>ModelTid = Symbol.for('D<%= Name %>ModelTid');
type TDTO = ID<%= Name %>GetResponseDTO;

export interface ID<%= Name %>Model<DTO extends TDTO = TDTO> extends IDomainModelBase<DTO> {
}

@Injectable()
export class D<%= Name %>Model<DTO extends TDTO = TDTO> extends DomainModelBase<DTO> implements ID<%= Name %>Model<DTO> {

}
