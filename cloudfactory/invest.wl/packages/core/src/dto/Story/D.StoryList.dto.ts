import { TDurationISO8601, TModelId } from '../../types';
import { IDImageDefault } from '../Image/D.Image.dto';

export interface IDStoryListRequestDTO {
  pageSize?: number;
  offset?: number;
}

export interface IDStoryListResponseDTO extends Array<IDStoryItemDTO> {

}

export interface IDStoryItemDTO {
  // id = storyId
  id: TModelId;
  Title: string;
  MainImage: IDImageDefault;
  LogoImage: IDImageDefault;
  Number: number;
  Steps: IDStoryStep[];
}

interface IDStoryStep {
  // id = StoryStepId
  id: TModelId;
  Text: string;
  Number: number;
  Image: IDImageDefault;
  ActionText: string;
  ActionDeepLink: string;
  TTS: TDurationISO8601;
  Title: string;
}
