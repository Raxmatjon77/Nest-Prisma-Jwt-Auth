import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RtStrategy } from './strategies/rt';
import { AtStrategy } from './strategies/at';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService,AtStrategy,RtStrategy]
})
export class AuthModule {}
