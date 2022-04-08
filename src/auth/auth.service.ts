import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';
import { Token } from './models/token.model';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { Prisma, User } from '@prisma/client';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async login({ email, password }: SigninDto): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found for the email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePasswordArgon(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({ userId: user.id });
  }

  async register(payload: SignupDto): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    try {
      const user = await this.usersService.create({
        ...payload,
        password: hashedPassword,
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async validateUser(userId: string): Promise<User> {
    return this.usersService.findUserById(userId);
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.usersService.findUserById(id);
  }

  generateTokens(payload: { userId: string }): Token {
    console.log('JWT Refresh', this.configService.get('JWT_REFRESH_SECRET'));

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.expiresIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({ userId });
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
