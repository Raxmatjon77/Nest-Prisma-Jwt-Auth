import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import  * as bcrypt from 'bcrypt';
import { hash } from 'crypto';
import { Tokens } from './types/type.tokens';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

hashdata(data: string): string {
  const hasheddata = bcrypt.hashSync(data, 10);
  return hasheddata;
}

  async localSignUp(dto:AuthDto): Promise<Tokens> {
   let  hash=this.hashdata(dto.password)
    const newUser = this.prisma.user.create({
      data: {
        email: dto.email,
        hash
      },
    });
  
  }
  localSignIn() {
    return 'local signin';
  }
  refresh() {
    return 'local signin';
  }
  logout() {
    return 'local signin';
  }
}
