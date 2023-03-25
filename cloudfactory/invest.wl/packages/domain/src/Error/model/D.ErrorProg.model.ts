import { IDErrorProgDTO, Injectable } from '@invest.wl/core';
import { DErrorModel, IDErrorModel } from './D.Error.model';

export const DErrorProgModelTid = Symbol.for('DErrorProgModelTid');
type TDTO = IDErrorProgDTO;

export interface IDErrorProgModel<DTO extends TDTO = TDTO> extends IDErrorModel<DTO> {

}

@Injectable()
export class DErrorProgModel<DTO extends TDTO = TDTO> extends DErrorModel<DTO> implements IDErrorProgModel<DTO> {

}
