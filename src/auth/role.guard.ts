import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import Role from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate  {
  constructor(private reflector: Reflector) {
    super();
  }
 async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    // รับข้อมูล Payload หลังจากตรวจสอบโทเค็น
    const { user } = context.switchToHttp().getRequest();
    
    
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
