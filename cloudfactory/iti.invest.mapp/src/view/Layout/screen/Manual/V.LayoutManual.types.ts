import { ImageURISource } from 'react-native';

export interface IVLayoutManualScreenProps { }

export interface IVLayoutManualItem {
  title: string;
  message: string;
  image?: ImageURISource;
}
