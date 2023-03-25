import { createParamDecorator, ExecutionContext, Req } from '@nestjs/common';
import { SECRET } from '../../config';
import * as jwt from 'jsonwebtoken';

// const SECRET = 'asdasdad';

export const User = createParamDecorator((data, ctx: ExecutionContext) => {
  // if route is protected, there is a user set in auth.middleware
  const req = ctx.switchToHttp().getRequest();
  console.log(req.user);
  if (req.user) {
    if (data === 'id') {
      return +req.user.user;
    }
    return data ? req.user[data].toString() : req.user;
  }

  // in case a route is not protected, we still want to get the optional auth user from jwt
  const token = req.switchToHttp().getRequest().headers.authorization
    ? (req.switchToHttp().getRequest().headers.authorization as string).split(
        ' ',
      )
    : null;
  if (token && token[1]) {
    const decoded: any = jwt.verify(token[1], SECRET);
    return data ? decoded[data] : decoded.user;
  }
});
