import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RateLimiterModule,RateLimiterGuard } from 'nestjs-rate-limiter';



@Module({
  controllers: [AuthController],
  
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    RateLimiterModule,
  ],
  providers: [AuthService, JwtStrategy,
    { 
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    }],
  exports: [AuthService]
})
export class AuthModule {}
