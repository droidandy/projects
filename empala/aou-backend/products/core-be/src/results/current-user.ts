import { createUnionType } from 'type-graphql';
import { User } from '../models/user';

export const CurrentUserResult = createUnionType({
  name: 'CurrentUserResult',
  description: 'Used for currentUser query',
  types: () => [User],
});
