import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class PasswordService {
  // constructor(private configService: ConfigService) {}

  async validatePasswordArgon(plain, hashed) {
    try {
      return await verify(hashed, plain);
    } catch (err) {
      console.log('failed at validatePassword');
    }
  }

  validatePasword(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000, true);
    });
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const hashed = await hash(password);
      return hashed;
    } catch {
      console.log('failed at hash password');
    }
  }
}
