import { ValidRoles } from "@auth/domain/interfaces/valid-roles";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "@auth/infrastructure/guards/user-role/user-role.guard";

export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    RoleProtected(...roles),
    // Use AuthGuard for JWT authentication and UserRoleGuard for role-based access control.
    UseGuards(AuthGuard(), UserRoleGuard)
  );

}