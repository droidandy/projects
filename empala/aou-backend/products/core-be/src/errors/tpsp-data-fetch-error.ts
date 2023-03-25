import { ObjectType } from 'type-graphql';
import { TypeWithMessageAndRequestId } from '../utils/graphql/common';

@ObjectType({
  implements: TypeWithMessageAndRequestId,
  description: 'Third-party Service Provider Error.  Used when we encounter an error communicating with an external service.',
})
export class TPSPDataFetchError extends TypeWithMessageAndRequestId { }
