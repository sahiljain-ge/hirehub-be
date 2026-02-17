import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import SubscriptionService from "../services/subscription.service.js";
import { sendSuccess } from "../utils/responseFormatter.js";

class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
    this.subscribeNewsLetter = this.subscribeNewsLetter.bind(this);
  }

  async subscribeNewsLetter(req: Request, res: Response) {
    await this.subscriptionService.subscribeNewsLetter(req.body.email);
    return sendSuccess(res, { subscribed: true }, 'NeswLetter successfully subscribed', StatusCodes.CREATED)
  }

}
export default SubscriptionController;