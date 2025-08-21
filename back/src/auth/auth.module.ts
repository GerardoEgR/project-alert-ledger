import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { UserModule } from '@user/user.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  imports: [
    ConfigModule,  // Import ConfigModule for environment variables
    UserModule, // Import UserModule to access UserService

    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with JWT strategy

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'), // Get JWT secret from environment variables
          signOptions: {
            expiresIn: '2h' // Token expiration time
          }
        }
      }
    })
  ],
  exports: [JwtStrategy, JwtModule, PassportModule, AuthService]
})
export class AuthModule { }
