import { BubbleNode } from '@dehimer/react-native-bubble-select';

import { StepContainerConfiguration } from '~/components/StepContainer/types';
import { CreateStackInput, CreateTagsInput } from '~/graphQL/core/generated-types';

export enum SubmitFields {
  email = 'email',
  password = 'password',
  fullName = 'fullName',
  user_name = 'user_name',
  userId = 'user_idp_id',
  follows = 'follows',
  stacks = 'stacks',
  tags = 'tags',
}

export type SignUpFormData = {
  [SubmitFields.email]: string;
  [SubmitFields.password]: string;
  [SubmitFields.fullName]: string;
  [SubmitFields.user_name]: string;
};

export enum DataFields {
  selectedInterests = 'selectedInterests',
  selectedCompanies = 'selectedCompanies',
  stackName = 'stackName',
  selectedInvestopeers = 'selectedInvestopeers',
  tagThemeIds = 'tagThemeIds',
  tagInstrumentId = 'tagInstrumentId',
  selectedCommunityStacks = 'selectedCommunityStacks',
}

export type DataFieldsType = {
  [DataFields.selectedInterests]?: { id: number | string }[];
  [DataFields.selectedCompanies]?: { id: string }[];
  [DataFields.stackName]?: string;
  [DataFields.selectedInvestopeers]?: { id: number | string }[];
  [DataFields.tagThemeIds]?: { id: string }[];
  [DataFields.tagInstrumentId]?: string;
  [DataFields.selectedCommunityStacks]?: { id: number | string }[];
};

export type BasicSubmitFields = {
  [SubmitFields.email]?: string;
  [SubmitFields.password]?: string;
  [SubmitFields.fullName]?: string;
  [SubmitFields.user_name]?: string;
};

export type SubmitFieldsType = BasicSubmitFields & {
  [SubmitFields.userId]?: string;
  [SubmitFields.follows]?: number[];
  [SubmitFields.stacks]?: CreateStackInput[];
  [SubmitFields.tags]?: CreateTagsInput[];
};

export type OnboardingContextData = StepContainerConfiguration & DataFieldsType & SubmitFieldsType;

export interface Bubbleable {
  toBubbleItem: () => BubbleNode;
}

export interface BubbleableConstructor {
  new(constructorArg: any): Bubbleable;
}

export function BubbleItemFactory(args: any, ctor: BubbleableConstructor): Bubbleable {
  return new ctor(args);
}

export type BubbleScreenData = {
  data: BubbleNode[];
  otherData?: any;
};
