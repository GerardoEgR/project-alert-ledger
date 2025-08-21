import { JwtPayload } from "@auth/domain/interfaces/jwt-payload.interface";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@user/domain/entities/user.entity";
import { UserFindOneBy } from "@user/domain/interfaces/user-creator.interface";
import { USER_FIND_ONE_BY } from "@user/infrastructure/tokens/user.constants";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * JWT Strategy for authenticating users based on JWT tokens.
 * It extracts the JWT from the Authorization header and validates the user.
 * If the token is valid, it returns the user object; otherwise, it throws an UnauthorizedException.
 * This strategy is used to protect routes and ensure that only authenticated users can access them.
 **/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    // Inject the UserFindOneBy interface to find users by ID
    @Inject(USER_FIND_ONE_BY) private readonly userFindOneBy: UserFindOneBy,

    // Inject the ConfigService to access environment variables
    configService: ConfigService,
  ) {
    super({
      // Extract JWT from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Get JWT secret from environment variables
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {

    const { id } = payload;

    const user = await this.userFindOneBy.findOneBy(id);

    if (!user)
      throw new UnauthorizedException('Invalid token');

    if (!user.isActive)
      throw new UnauthorizedException('User is not active, please contact support');

    return user; // Return the user object if the token is valid
  }
}