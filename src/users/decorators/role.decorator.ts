import { SetMetadata } from '@nestjs/common';
import { USER_ROLES_KEY, UserRole } from '../constants/role.const';

export const Roles = (role: UserRole) => SetMetadata(USER_ROLES_KEY, role);
