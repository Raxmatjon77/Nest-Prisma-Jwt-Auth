import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RtStrategy } from './strategies/rt';
import { AtStrategy } from './strategies/at';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from 'src/common/middlewares/logger-middlware';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({path:'/auth/local/signin', method: RequestMethod.ALL });
  }
}
