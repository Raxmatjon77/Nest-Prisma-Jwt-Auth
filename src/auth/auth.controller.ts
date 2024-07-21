import { Body, Controller, HttpCode, Post, UseGuards ,Req, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/type.tokens';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './types/express-request.interface';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignUp(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.localSignUp(dto);
  }
  @Post('local/signin')
  localSignIn(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.localSignIn(dto);
  }
  @Post('refresh')
  refresh() {
    return this.authService.refresh();
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: RequestWithUser) {
    console.log("user",req.user);
    
    const userId = req.user.sub;
    return this.authService.logout(userId);
  }
}
