import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtTokenPayload } from '../classes/JwtTokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    // @Inject(forwardRef(() => UserService))
    // private usersService: UserService,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    private jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHmac('sha256', password).digest('hex');
  }

  async login(dto: LoginDto) {
    dto.password = this.hashPassword(dto.password);

    const user = await this.userRepository.findOne({
      email: dto.email,
      password: dto.password,
    });

    if (!user) {
      console.log(`No user found for email ${dto.email}`);
      throw new HttpException(
        { user: 'Password not correct!' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!user.activated) {
      console.log(`User found but not activiated for email ${dto.email}`);
      throw new HttpException(
        { user: 'User not activated' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const payload: JwtTokenPayload = {
      // public
      sub: user.id,
      email: user.email,

      // private
      user: user.id,
      company: user.company?.id,
      super_admin: user.roles === 'admin',
      // todo: enumerate roles as CAN* model
      permissions: [user.roles],
    };

    return {
      user: {
        ...user,
        token: this.jwtService.sign(payload),
      },
    };
  }
}
