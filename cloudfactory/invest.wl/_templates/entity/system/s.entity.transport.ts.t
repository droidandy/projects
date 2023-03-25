---
to: src/system/<%= Name %>/S.<%= Name %>.transport.ts
---
import { Inject, Injectable } from '_common/IoC';
import { I<%= Name %>DTO } from '_system/<%= Name %>/S.<%= Name %>.types';

export const S<%= Name %>TransportTid = Symbol.for('S<%= Name %>Transport');

@Injectable()
export class S<%= Name %>Transport {
  constructor(
  ) {}
}
