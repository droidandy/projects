import { ObjectType } from 'type-graphql';
import { TypeWithMessageAndRequestId } from '../utils/graphql/common';

@ObjectType({ implements: TypeWithMessageAndRequestId })
export class TooManyItemsRequestedError extends TypeWithMessageAndRequestId {}
