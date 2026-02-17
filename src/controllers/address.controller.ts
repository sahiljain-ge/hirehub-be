import { Request, Response } from 'express';
import AddressService from '../services/address.service.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { StatusCodes } from 'http-status-codes';

class AddressController {
  constructor(private readonly addressService: AddressService) {
    this.addressService = addressService;
    this.getAllAddress = this.getAllAddress.bind(this);
  }
  async getAllAddress(req: Request, res: Response) {
    const response = await this.addressService.getAllAddress();
    return sendSuccess(
      res,
      response,
      'Successfully fetched all available addressess',
      StatusCodes.OK,
    );
  }
}

export default AddressController;
