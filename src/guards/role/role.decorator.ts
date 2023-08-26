import { SetMetadata } from '@nestjs/common';

export const AnyOfRole = (roles: string[]) => SetMetadata('anyOfRole', roles);

export const AllRoles = (roles: string[]) => SetMetadata('allRoles', roles);
