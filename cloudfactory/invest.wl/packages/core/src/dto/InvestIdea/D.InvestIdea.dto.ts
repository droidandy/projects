import { TModelId } from '../../types';
import { IDImageSized } from '../Image/D.Image.dto';

export interface IDInvestIdeaIdentityPart {
  // id = investIdeaId
  id: TModelId;
  Title: string;
  IdeaType: EDInvestIdeaType;
  Image: IDImageSized;
}

export enum EDInvestIdeaType {
  Hold = 0,
  Buy = 1,
  Sell = -1,
  Period = 2,
  Strategy = 3,
}

export enum EDInvestIdeaInstrumentType {
  All = 0,
  ShareRu = 1,
  ShareUsa = 2,
  BondRu = 3,
}
