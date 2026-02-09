import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import transporter from '../config/nodemailer.config.js';
import AppError from '../utils/AppError.js';

const sendEmail = async (receiverEmail: string, subject: string, emailTemplate: string) => {
  try {
    const info = await transporter.sendMail({
      from: 'hirehub-noreply.hirehub.io',
      to: receiverEmail,
      subject: subject,
      html: emailTemplate,
    });
    logger.info(`email sent, messageId: ${info.messageId}`);
  } catch (error) {
    logger.error(`failed to sent email, ${error}`);
    throw new AppError(`Failed to sent email`, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export default sendEmail;
