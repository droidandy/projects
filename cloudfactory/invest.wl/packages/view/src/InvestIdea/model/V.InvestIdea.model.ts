import { Injectable } from '@invest.wl/core';
import { IVInvestIdeaItemModel, VInvestIdeaItemModel } from './V.InvestIdeaItem.model';

export const VInvestIdeaModelTid = Symbol.for('VInvestIdeaModelTid');

export interface IVInvestIdeaModel extends IVInvestIdeaItemModel {
}

@Injectable()
export class VInvestIdeaModel extends VInvestIdeaItemModel implements IVInvestIdeaModel {
}
