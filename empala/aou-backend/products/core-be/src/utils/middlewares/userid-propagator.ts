import { MiddlewareFn } from 'type-graphql';

export const UserIdPropagator: MiddlewareFn<any> = async ({ context, root }, next) => {
  let userId: BigInt;
  if (root) {
    if (root.constructor.name === 'User') {
      userId = root.id;
    } else if (root.hasOwnProperty('userId')) {
      userId = root.userId;
    }
  }
  if (!userId && context.metadata && context.metadata.user && context.metadata.user.id) {
    userId = context.metadata.user.id;
  }
  const result = await next();
  if (result && userId) {
    if (Array.isArray(result)) {
      if (result.length > 0 && result[0].hasOwnProperty('id') && !result[0].userId) {
        result.forEach((_part, index) => {
          result[index].userId = userId;
          return userId;
        });
      }
    } else if (result.hasOwnProperty('id') && !result.userId) {
      result.userId = userId;
    }
  }
  return result;
};
