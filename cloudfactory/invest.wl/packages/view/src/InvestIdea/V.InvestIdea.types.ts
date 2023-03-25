import { IVInvestIdeaPresentProps } from './present/V.InvestIdea.present';
import { IVInvestIdeaListPresentProps } from './present/V.InvestIdeaList.present';

export enum EVInvestIdeaScreen {
  InvestIdea = 'InvestIdea',
  InvestIdeaList = 'InvestIdeaList',
}

export interface IVInvestIdeaScreenParams {
  InvestIdea: IVInvestIdeaPresentProps;
  InvestIdeaList: IVInvestIdeaListPresentProps;
}
