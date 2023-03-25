import { FunctionComponent, SVGProps } from 'react';

export enum Condition {
  /** Просто деньги (Кредит наличными) */
  JUST_MONEY,
  /** Покупка машины (промежуточный шаг) */
  BUYING_CAR,
  /** Б/У автомобиль у диллера (Кредит наличными (гибрид)) */
  AUTHORIZED_DEALER,
  /** Б/У автомобиль у собственника (Автокредит C2C или Кредит наличными (гибрид)) */
  C2C,
}

export enum ConditionBranchName {
  FIRST_BRANCH = '1Branch',
  SECOND_BRANCH = '2Branch',
}

export interface ConditionTree {
  [ConditionBranchName.FIRST_BRANCH]: null | Condition.BUYING_CAR | Condition.JUST_MONEY;
  [ConditionBranchName.SECOND_BRANCH]: null | Condition.AUTHORIZED_DEALER | Condition.C2C;
}

export interface ConditionData {
  name: string;
  type: Condition;
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  IconActive: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export enum CreditRoutes {
  JUST_MONEY = 'cash-online',
  AUTHORIZED_DEALER = 'avtokredit',
  C2C = 'c2c',
}
