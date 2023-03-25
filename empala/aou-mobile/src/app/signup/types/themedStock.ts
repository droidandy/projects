import { Bubbleable } from './base';

import { BaseResponse } from '~/network/useFetch';

export class ThemedStock implements BaseResponse, Bubbleable {
  constructor({
    id,
    theme_id,
    symbol,
    description,
  }: {
    id: number;
    theme_id: number;
    symbol: string;
    description: string;
  }) {
    this.id = id;
    this.theme_id = theme_id;
    this.symbol = symbol;
    this.description = description;
  }

  id: number;

  theme_id: number;

  symbol: string;

  description: string;

  toBubbleItem = () => ({
    key: this.id,
    id: this.symbol,
    text: this.description,
  });
}
