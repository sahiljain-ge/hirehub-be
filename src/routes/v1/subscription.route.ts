import expres from 'express';
import SubscriptionRepository from '../../repositories/subscription.repository.js';
import SubscriptionController from '../../controllers/subscription.controller.js';
import SubscriptionService from '../../services/subscription.service.js';
import emailValidator from '../../validators/email.validator.js';
import { emailSchema } from '../../schemas/email.schema.js';

const router = expres.Router();

const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);


router.post('/newsletter', emailValidator(emailSchema), subscriptionController.subscribeNewsLetter);


export default router;