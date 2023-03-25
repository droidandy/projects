---
to: src/domain/<%= Name %>/D.<%= Name %>.gateway.ts
---
import { Inject, Injectable } from '../../common/IoC';
import { ID<%= Name %>Adapter, D<%= Name %>AdapterTid } from './D.<%= Name %>.types';

export const D<%= Name %>GatewayTid = Symbol.for('D<%= Name %>GatewayTid');

@Injectable()
export class D<%= Name %>Gateway {
  constructor(
    @Inject(D<%= Name %>AdapterTid) private adapter: ID<%= Name %>Adapter,
  ) {}
}
