import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRole } from '../entities/user.entity';

//this guard will protect any routes reserved only for TMM access.
// The client/admin can not and will not see whatever endpoints this is guarding
@Injectable()
export class DevGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.adminFindUser(request.user.userId);
    return user.roles == UserRole.DEV;
  }
}
