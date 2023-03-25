export interface IQuestionDTO {
  id: string;
  // Порядок отображения для section
  show_order: number;
  section: EQuestionSection;
  name: string;
  required: number;
  type: EQuestionType;
  text?: string;
  description?: string;
  answer?: IQuestionAnswer;
  options?: IQuestionOptionDTO[];
}

export type TQuestionAnswerValue = boolean | string | number;

export interface IQuestionOptionDTO {
  value: TQuestionAnswerValue;
  text?: string;
  description?: string;
}

export interface IQuestionAnswer {
  value?: TQuestionAnswerValue;
}

export interface IQuestionSaveDTO {
  question_id: string;
  value: TQuestionAnswerValue;
}

export interface IQuestionSectionDTO {
  id: string;
  code: EQuestionSection;
  caption: string;
  quiz_questions?: { aggregate?: { count: number } };
}

// КЛЮЧИ не менять! совпадают с integration name
export enum EQuestionSection {
  hidden = 'hidden',
  // Анкета, Шаг 5 (если будет)
  general = 'general',
  // Анкета, Шаг 6
  pdl = 'pdl',
  // Анкета, Шаг 7
  fatca_crs = 'fatca_crs',
  // Заявление квал. инвестора 1 часть
  qualifiedInvestor_1 = 'qualifiedInvestor_1',
  // Заявление квал. инвестора 2 часть
  qualifiedInvestor_2 = 'qualifiedInvestor_2',
  // Заявление открытия договора ИИС
  IISOpen = 'IISOpen',
  // Заявление открытия договора ДУ
  DUOpen = 'DUOpen',
  // Заявление открытия договора PIF
  PIFOpen = 'PIFOpen',
}

export enum EQuestionType {
  // checkbox (Чекбокс)
  Checkbox = 1,
  // radio (Радиобаттон)
  Radio = 2,
  // droplist (Список)
  Droplist = 3,
  // edit (Редактируемое поле)
  Input = 4,
  // file (Файл)
  File = 5,
}

export enum EQuestionRequired {
  Yes = 1,
  No = 0,
}
