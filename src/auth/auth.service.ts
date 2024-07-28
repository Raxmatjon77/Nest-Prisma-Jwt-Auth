import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { hash } from 'crypto';
import { Tokens } from './types/type.tokens';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private JWTServise: JwtService,
  ) {}

  async localSignUp(dto: AuthDto): Promise<Tokens> {
    let hash = this.hashdata(dto.password);
    let existuser=this.prisma.user.findMany({
      where:{
        email:dto.email
      }
    })
    if (existuser) {
      throw new BadRequestException('User with this email is already exist !')
    }
    console.log(existuser);
    
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }
  async localSignIn(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new NotFoundException('User Not found !');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) {
      throw new ForbiddenException('Access denied !');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  async refresh(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log('rt', rt);
    console.log('hash', user.hashedRt);

    if (!user) throw new NotFoundException('User not Found !');
    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('access denied !');

    const tokens = await this.getTokens(userId, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: { hashedRt: null },
    });
    return { message: 'Logged out successfully' };
  }
  hashdata(data: string): string {
    const hasheddata = bcrypt.hashSync(data, 10);
    return hasheddata;
  }
  async getTokens(UserId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.JWTServise.signAsync(
        {
          sub: UserId,
          email,
        },
        {
          expiresIn: 60 * 15,
          secret: process.env.JWT_AT_SECRET,
        },
      ),
      this.JWTServise.signAsync(
        {
          sub: UserId,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: process.env.JWT_RT_SECRET,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(id: number, rt: string) {
    const updatedRt = this.hashdata(rt);
    await this.prisma.user.update({
      where: { id: id },
      data: {
        hashedRt: updatedRt,
      },
    });
  }
}
