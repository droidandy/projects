---
to: src/domain/<%= Name %>/D.<%= Name %>.const.ts
---
import { Injectable } from '../../common/IoC';

export const D<%= Name %>ConstTid = Symbol.for('D<%= Name %>ConstTid');

@Injectable()
export class D<%= Name %>Const {

}
