import { ReactComponentElement } from 'react';
import { CARDS } from './constants';

export interface ProfileCard {
  id: CARDS;
  title: string;
  subtitle?: string;
  link: string;
  icon: ReactComponentElement<any>;
}

export interface ProfileCards {
  mainCards: ProfileCard[];
  subCards: ProfileCard[];
}
