import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/type.tokens';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){

    }
  @Post('local/signup')
  @HttpCode(201)
  localSignUp(@Body() dto: AuthDto):Promise<Tokens> {
    return this.authService.localSignUp(dto);
  }
  @Post('local/signin')
  localSignIn() {
    return this.authService.localSignIn();
  }
  @Post('refresh')
  refresh() {
    return this.authService.refresh();
  }
  @Post('logout')
  logout() {
    return this.authService.logout();   
  }
}
