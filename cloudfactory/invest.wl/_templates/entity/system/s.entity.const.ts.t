---
to: src/system/<%= Name %>/S.<%= Name %>.const.ts
---
import { Injectable } from '../../common/IoC';

export const S<%= Name %>ConstTid = Symbol.for('S<%= Name %>ConstTid');

@Injectable()
export class S<%= Name %>Const {

}
