import { Bubbleable } from './base';

import { BaseResponse } from '~/network/useFetch';

export class InterestTheme implements BaseResponse, Bubbleable {
  constructor({ id, name }: { id: number; name: string }) {
    this.id = id;
    this.name = name;
  }

  id: number;

  name: string;

  toBubbleItem = () => ({
    key: this.id,
    id: this.id.toString(),
    text: this.name,
  });
}
