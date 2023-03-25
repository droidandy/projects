import { DModelXValue, IDModelXValue } from '@invest.wl/common';
import { IDInstrumentAlertCountResponseDTO, Injectable } from '@invest.wl/core';

export const DInstrumentAlertCountModelTid = Symbol.for('DInstrumentAlertCountModelTid');
type TDTO = IDInstrumentAlertCountResponseDTO;

export interface IDInstrumentAlertCountModel<DTO extends TDTO = TDTO> extends IDModelXValue<DTO> {
}

@Injectable()
export class DInstrumentAlertCountModel<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IDInstrumentAlertCountModel<DTO> {

}
