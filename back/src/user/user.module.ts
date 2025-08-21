import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { USER_CREATOR, USER_FIND_ONE_BY, USER_FINDER } from './infrastructure/tokens/user.constants';
import { PassportModule } from '@nestjs/passport';


@Module({
  controllers: [UserController],
  providers: [
    UserService,
    // Provide the UserService as the implementation for the USER_CREATOR, USER_FINDER, and USER_FIND_ONE_BY tokens.
    // This allows other modules to inject these tokens to access the UserService methods.
    // This is necessary because UserService is used in AuthModule for user-related operations.
    // and we need to avoid circular dependencies.
    { provide: USER_CREATOR, useExisting: UserService },
    { provide: USER_FINDER, useExisting: UserService },
    { provide: USER_FIND_ONE_BY, useExisting: UserService }
  ],
  imports: [
    // Import TypeOrmModule with User entity to allow UserService to use userRepository
    TypeOrmModule.forFeature([User]),

    // This allows the application to use JWT authentication for protected routes
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  exports: [USER_CREATOR, USER_FINDER, USER_FIND_ONE_BY]
})
export class UserModule { }
