import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtTokenPayload } from '../../auth/classes/JwtTokenPayload.interface';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtTokenPayload = request.user;

    console.log('CompanyGuard: ', user);

    if (!user) return false;

    if (user.super_admin) return true;

    if (!user.company) return false;

    if (request.params && request.params.companyId) {
      const companyId: number = +request.params.companyId;

      if (user.company !== companyId) return false;
    }

    return true;
  }
}
