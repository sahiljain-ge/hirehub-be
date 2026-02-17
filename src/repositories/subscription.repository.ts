import { StatusCodes } from "http-status-codes";
import db from "../config/prisma.js";
import type { Email } from "../schemas/email.schema.js";
import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";
class SubscriptionRepository {

  async subscribeNewsLetter(email: string) {
    try {
      const alreadySubscribed = await db.newsSubscriber.findUnique({
        where: {
          email
        }
      });
      if (alreadySubscribed) throw new AppError('You have already subscribed!', StatusCodes.CONFLICT);
      return await db.newsSubscriber.create({
        data: {
          email: email
        }
      });
    } catch (error) {
      logger.error(error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Failed to create job due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
export default SubscriptionRepository;