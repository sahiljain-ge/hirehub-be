import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';

export const generateOTP = async () => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const hashedOTP = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  return { otp, hashedOTP, expiresAt };
};

export const verifyOTP = async (plainOTP: string, hashedOTP: string, expiresAt: Date) => {
  if (expiresAt < new Date()) {
    throw new Error('OTP_EXPIRED');
  }

  const isValid = await bcrypt.compare(plainOTP, hashedOTP);
  if (!isValid) {
    throw new Error('INVALID_OTP');
  }

  return true;
};
