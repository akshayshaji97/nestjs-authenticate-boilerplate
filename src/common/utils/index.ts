import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

export const generateOTP = (otpLength = 6) => {
  let otp = '';
  const possible = '1234567890';

  for (let i = 0; i < otpLength; i += 1) {
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return otp;
};

export const generatePasswordHash = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return { hashedPassword };
};

export const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};
