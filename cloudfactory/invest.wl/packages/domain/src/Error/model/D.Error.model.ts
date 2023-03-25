import { ErrorModel, IErrorModel } from '@invest.wl/common';
import { IDErrorDTO } from '@invest.wl/core';

type TDTO = IDErrorDTO;

export interface IDErrorModel<DTO extends TDTO = TDTO> extends IErrorModel<DTO> {

}

export abstract class DErrorModel<DTO extends TDTO = TDTO> extends ErrorModel<DTO> implements IDErrorModel<DTO> {

}
