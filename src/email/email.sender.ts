import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';
import emailjs from '@emailjs/nodejs';
import {
  EMAILJS_PRIVATE_KEY,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
} from '../config/server-config.js';

const sendOtp = async (receiverEmail: string, otp: string, templateId: string) => {
  try {
    const res = await emailjs.send(
      EMAILJS_SERVICE_ID!,
      templateId!,
      { email: receiverEmail, otp },
      {
        privateKey: EMAILJS_PRIVATE_KEY!,
        publicKey: EMAILJS_PUBLIC_KEY!,
      },
    );
    logger.info(`email sent, status: ${res.status}`);
    return true;
  } catch (error) {
    logger.error(`failed to sent email, ${error}`);
    throw new AppError(`Failed to sent email`, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export default sendOtp;
