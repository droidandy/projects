import { ForbiddenError } from 'apollo-server';
import { AuthChecker } from 'type-graphql';
import { IContext } from '../utils/context-interface';

export enum EAccessRole {
  READONLY_ADMIN = 'READONLY_ADMIN',
  MARKETDATA_UPDATER = 'MARKETDATA_UPDATER',
  LAUNCHPAD_USER = 'LAUNCHPAD_USER',
  LAUNCHPAD_USER_TO_BE_CREATED = 'LAUNCHPAD_USER_TO_BE_CREATED',
  IF_LAUNCHPAD_USER_DETERMINED = 'IF_LAUNCHPAD_USER_DETERMINED',
}

export const authChecker: AuthChecker<IContext, EAccessRole> = (
  {
    root, context, info,
  },
  roles,
) => {
  let isAuth = false;
  /* istanbul ignore else */
  if (context.metadata.role !== undefined) {
    isAuth = roles.includes(context.metadata.role);
    if (isAuth && context.metadata.role === EAccessRole.LAUNCHPAD_USER) {
      isAuth = context.metadata.user !== undefined;
    }
    if (!isAuth && roles.includes(EAccessRole.LAUNCHPAD_USER_TO_BE_CREATED)) {
      isAuth = info.parentType.name === 'Mutation' && info.fieldName === 'createUser'
        && context.metadata.token !== undefined;
    }
    if (!isAuth && roles.includes(EAccessRole.IF_LAUNCHPAD_USER_DETERMINED)) {
      // eslint-disable-next-line operator-linebreak
      isAuth =
        /* istanbul ignore next */ context.metadata.user !== undefined || (root !== undefined
        && ((root.constructor.name === 'User' && root.id !== undefined) || root.hasOwnProperty('userId')));
    }
  }
  if (!isAuth) {
    if (context.metadata.token !== undefined && context.metadata.user === undefined) {
      throw new ForbiddenError('Access denied! You need to call createUser before!');
    } else {
      throw new ForbiddenError('Access denied! You need to be authorized to perform this action!');
    }
  }
  return true;
};
