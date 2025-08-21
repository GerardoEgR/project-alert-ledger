import { Reflector } from "@nestjs/core";
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "@user/domain/entities/user.entity";
import { META_ROLES } from "@auth/infrastructure/decorators/role-protected.decorator";

/**
 * Guard to check if the user has the required roles to access a route.
 * It uses the Reflector to get the roles defined in the route metadata.
 */
@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())

    if (!validRoles || validRoles.length === 0) return true; // If no roles are defined, allow access

    const request = context.switchToHttp().getRequest();
    const user = request.user as User; // Get the user from the request object

    if (!user)
      throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true; // If the user's role is in the list of valid roles, allow access
      }
    }
    throw new ForbiddenException(`The user ${user.fullName} is not allowed, valid roles are: ${validRoles.join(', ')}`);
  }
}