import { TDurationISO8601 } from '@invest.wl/core';

export interface IGetStoryListRequest {
  StoryId?: string;
  offset?: number;
  pageSize?: number;
  // groupId?: EDStoryGroupType;
}

export interface IGetStoryListResponse extends Array<IGetStoryListResponseItem> {
}

export interface IGetStoryListResponseItem {
  StoryId: number;
  Title: string;
  Number: number;
  MainImage: { Default: string };
  LogoImage: { Default: string };
  Steps: IStoryStep[];
}

export interface IStoryStep {
  StoryStepId: number;
  Text: string;
  Title: string;
  Number: number;
  Image: { Default: string };
  ActionText: string;
  ActionDeepLink: string;
  TTS: TDurationISO8601;
}
