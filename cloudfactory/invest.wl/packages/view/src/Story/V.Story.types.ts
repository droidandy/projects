import { IVStoryPresentProps } from './present/V.Story.present';
import { IVStoryListPresentProps } from './present/V.StoryList.present';

export enum EVStoryScreen {
  Story = 'Story',
  StoryList = 'StoryList',
}

export interface IVStoryScreenParams {
  Story: IVStoryPresentProps;
  StoryList: IVStoryListPresentProps;
}
