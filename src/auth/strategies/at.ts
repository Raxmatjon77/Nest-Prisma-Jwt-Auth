
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

type JwtPayload={
  sub:string,
  email:string
}
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_AT_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    console.log('JWT Payload:', payload); // Add logging here
    return { sub: payload.sub, email: payload.email };
  }
}
  