import { MiddlewareFn } from 'type-graphql';
import shortUUID from 'short-uuid';
import { GraphQLResolveInfo } from 'graphql';
import { ArgsDictionary } from 'type-graphql/dist/interfaces/ResolverData';
import { asyncLocalStorage } from '../../../../utils/src/logger';

export interface ResolverData<ContextType = { requestId?: string }> {
  root: any;
  args: ArgsDictionary;
  context: ContextType;
  info: GraphQLResolveInfo;
}

export const RequestId: MiddlewareFn = async (params: ResolverData, next) => {
  const requestId: string = params.context.requestId || shortUUID.generate();
  await asyncLocalStorage.run({ requestId }, async () => {
    params.context.requestId = requestId;
    return next();
  });
};
