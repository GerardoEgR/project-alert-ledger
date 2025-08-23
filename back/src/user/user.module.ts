import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { USER_CRUD } from './infrastructure/tokens/user.constants';


@Module({
  controllers: [UserController],
  providers: [
    UserService,
    // Provide the UserService as the implementation for the USER_CRUD tokens.
    // This allows other modules to inject these tokens to access the UserService methods.
    // This is necessary because UserService is used in AuthModule for user-related operations.
    // and we need to avoid circular dependencies.
    { provide: USER_CRUD, useExisting: UserService },
  ],
  imports: [
    // Import TypeOrmModule with User entity to allow UserService to use userRepository
    TypeOrmModule.forFeature([User]),

    // This allows the application to use JWT authentication for protected routes
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  exports: [USER_CRUD]
})
export class UserModule { }
