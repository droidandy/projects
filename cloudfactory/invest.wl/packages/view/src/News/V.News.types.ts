import { IVNewsPresentProps } from './present/V.News.present';
import { IVNewsListPresentProps } from './present/V.NewsList.present';

export enum EVNewsScreen {
  News = 'News',
  NewsList = 'NewsList',
}

export interface IVNewsScreenParams {
  News: IVNewsPresentProps;
  NewsList: IVNewsListPresentProps;
}
