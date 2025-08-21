import { SetMetadata } from "@nestjs/common";
import { ValidRoles } from "@auth/domain/interfaces/valid-roles";

export const META_ROLES = 'roles';

/**
 *  This decorator sets the metadata for the roles that are allowed to access the route.
 * It can be used in conjunction with guards to enforce role-based access control.
 * 
 * @param args ValidRoles[] - Array of valid roles that can access the route
 * @param args Valid roles to protect the route
 * @example
 * @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
 * @RoleProtected(ValidRoles.user)
 */
export const RoleProtected = (...args: ValidRoles[]) => {


  return SetMetadata(META_ROLES, args);
}