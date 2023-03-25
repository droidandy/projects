import { Injectable } from '@invest.wl/core';
import { IVNewsItemModel, VNewsItemModel } from './V.NewsItem.model';

export const VNewsModelTid = Symbol.for('VNewsModelTid');

export interface IVNewsModel extends IVNewsItemModel {
}

@Injectable()
export class VNewsModel extends VNewsItemModel implements IVNewsModel {

}
