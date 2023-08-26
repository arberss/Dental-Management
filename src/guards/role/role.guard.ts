import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const anyOfRole = this.reflector.get<string[]>(
      'anyOfRole',
      context.getHandler(),
    );

    const allRoles = this.reflector.get<string[]>(
      'allRoles',
      context.getHandler(),
    );

    if (!anyOfRole && !allRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (anyOfRole) {
      // Check if the user has at least one of the required roles
      if (anyOfRole.some((role) => user.roles.includes(role))) {
        return true;
      }
    } else {
      // Check if the user has all the required roles
      if (allRoles.every((role) => user.roles.includes(role))) {
        return true;
      }
    }

    return false;
  }
}
