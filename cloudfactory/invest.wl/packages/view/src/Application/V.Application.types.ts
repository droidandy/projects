import { IVApplicationVersionPresentProps } from './present/V.ApplicationVersion.present';

export enum EVApplicationScreen {
  ApplicationVersion = 'ApplicationVersion',
}

export interface IVApplicationScreenParams {
  ApplicationVersion: IVApplicationVersionPresentProps;
}
