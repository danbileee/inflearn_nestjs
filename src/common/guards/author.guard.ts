import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Type,
} from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';
import {
  AUTHOR_SERVICE_KEY,
  BYPASS_ROLE_KEY,
} from 'src/common/decorators/author.decorator';
import { AuthorService } from 'src/common/services/author.service';
import { UserRole } from 'src/users/constants/role.const';
import { UserModel } from 'src/users/entities/user.entity';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserModel = request.user;
    const bypassRoles = this.reflector.get<UserRole[]>(
      BYPASS_ROLE_KEY,
      context.getHandler(),
    );

    if (bypassRoles?.includes(user?.role)) {
      return true;
    }

    const serviceToken = this.reflector.get<Type<AuthorService>>(
      AUTHOR_SERVICE_KEY,
      context.getHandler(),
    );

    if (!serviceToken) {
      throw new Error('Missing author service token metadata');
    }

    const service = this.moduleRef.get<AuthorService>(serviceToken, {
      strict: false,
    });

    if (!service) {
      throw new Error(`${serviceToken} not found`);
    }

    const resourceId = request.params.id;

    const isAuthor = await service.isAuthor(user.id, resourceId);

    if (!isAuthor) {
      throw new ForbiddenException(
        'NO PERMISSION: Only the author can access to this feature.',
      );
    }

    return true;
  }
}
