import SubscriptionRepository from "../repositories/subscription.repository.js";
import { Email } from "../schemas/email.schema.js";

class SubscriptionService {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) { }

  subscribeNewsLetter(email: string) {
    // TODO: add email notification
    return this.subscriptionRepository.subscribeNewsLetter(email);
  }
}

export default SubscriptionService;