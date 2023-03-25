export type TDQuestionAnswerValue = boolean | string | number;

export enum EDQuestionSection {
  Hidden = 'hidden',
  // анкута публичного должностного лица (подтвердить что не являюсь)
  PDL = 'pdl',
  // анкета общей информации
  General = 'general',
  // анкета налогового резидента другой страны
  FatcaCrs = 'fatcacrt',
}

export type TDQuestionSection = 'Hidden' | 'PDL' | 'General' | 'FatcaCrs' | string;

export interface IDQuestionDTO {
  id: string;
  // Порядок отображения для section
  ordering: number;
  name: string;
  required?: boolean;
  section: TDQuestionSection;
  displayType: EDQuestionDisplayType;
  text?: string;
  description?: string;
  answer?: IDQuestionAnswerDTO;
  optionList?: IDQuestionOptionDTO[];
}

export interface IDQuestionOptionDTO {
  value: TDQuestionAnswerValue;
  text: string;
  description?: string;
}

export interface IDQuestionAnswerDTO {
  value?: TDQuestionAnswerValue;
}

export interface IDQuestionAnswerSaveDTO {
  questionId: string;
  value: TDQuestionAnswerValue;
}

export interface IDQuestionSectionDTO {
  id: string;
  name: string;
  code: TDQuestionSection;
  questionCount?: number;
}

export enum EDQuestionDisplayType {
  // чекбокс
  Checkbox = 1,
  // радиобаттон
  Radio = 2,
  // выпадающий список
  Dropdown = 3,
  // редактируемое поле
  Input = 4,
  // файл
  File = 5,
}
