import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "@user/application/dto/create-user.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtPayload } from "@auth/domain/interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { USER_CREATOR, USER_FINDER } from "@user/infrastructure/tokens/user.constants";
import { UserCreator, UserFinder } from "@user/domain/interfaces/user-creator.interface";


/**
 *  It provides methods for user authentication and registration.
 */
@Injectable()
export class AuthService {

  constructor(
    // Inject the UserCreator interface to create users 
    @Inject(USER_CREATOR) private readonly userCreator: UserCreator,

    // Inject the UserFinder interface to find users
    @Inject(USER_FINDER) private readonly userFinder: UserFinder,

    // Inject the JwtService to generate JWT tokens
    private readonly jwtService: JwtService
  ) { }

  /**
   *  This method creates a new user and returns the user object along with a JWT token.
   *  It uses the UserService to create the user and the JwtService to generate a JWT token for the user.
   *  It throws an error if the user already exists or if there is a database error.
   *  @param createUserDto - The data transfer object containing user details to create a new user.
   *  @returns - The created user object along with a JWT token.
   **/
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userCreator.createUser(createUserDto);
    const { password, ...rest } = user; // Exclude the password from the returned user object

    return {
      ...rest,
      token: this.getJwtToken({ id: user.id }) // Generate JWT token for the newly created user
    };
  }

  /**
   *  This method logs in a user by validating the provided credentials.
   *  It uses the UserService to find the user and validate the password.
   *  If the credentials are valid, it returns the user object along with a JWT token.
   *  
   *  @param loginDto - The login data transfer object containing email and password.
   *  @returns - The logged-in user object along with a JWT token.
   *  @throws BadRequestException if the credentials are invalid.
   *  @throws UnauthorizedException if the user is not active.
   **/
  async login(loginDto: LoginDto) {
    const user = await this.userFinder.login(loginDto);
    const { password, ...rest } = user; // Exclude the password from the returned user object

    return {
      ...rest,
      token: this.getJwtToken({ id: user.id }) // Generate JWT token for the user
    };
  }

  /**
   *  This method generates a JWT token for the user based on the provided payload
   *  The token is signed using the secret key defined in the JWT module configuration
   *  The generated token can be used for authenticating requests to protected routes
   *  @param payload - The payload containing user information to be included in the JWT token (like email or user ID)
   *  @returns {string} - The generated JWT token
   **/
  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}