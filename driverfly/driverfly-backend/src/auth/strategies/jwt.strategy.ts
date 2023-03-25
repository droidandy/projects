import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SECRET } from '../../config';
import { JwtTokenPayload } from '../classes/JwtTokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET,
      jsonWebTokenOptions: { ignoreExpiration: true },
    });
  }

  validate(payload: JwtTokenPayload): JwtTokenPayload {
    return payload;
  }
}
