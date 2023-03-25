---
to: src/domain/<%= Name %>/D.<%= Name %>.types.ts
---
import {
  ID<%= Name %>ListRequestDTO, ID<%= Name %>ListResponseDTO,
  ID<%= Name %>SetRequestDTO, ID<%= Name %>SetResponseDTO,
} from './dto';

export const D<%= Name %>AdapterTid = Symbol.for('D<%= Name %>AdapterTid');

export interface ID<%= Name %>Adapter {
  Set(req: ID<%= Name %>SetRequestDTO): Promise<ID<%= Name %>SetResponseDTO>;
  List(req: ID<%= Name %>ListRequestDTO): Promise<ID<%= Name %>ListResponseDTO>;
}
