export enum CARD_SPENDING {
  MORE = 0,
  NONE = 1,
}

export interface SavingsAccountRate {
  /** ID */
  id: number;
  /** Сумма на накопительном счёте */
  amount: string;
  /** Базовая процентная ставка */
  basicRate: number;
  /** Процентная ставка при использовании карты Автодрайв */
  higherRate: number;
  /** Очередность */
  order: number;
}
