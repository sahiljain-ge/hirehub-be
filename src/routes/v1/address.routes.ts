import express from 'express';
import AddressRepository from '../../repositories/address.repository.js';
import AddressService from '../../services/address.service.js';
import AddressController from '../../controllers/address.controller.js';
import asyncHandler from '../../middlewares/asyncHandler.js';

const router = express.Router();
const addressRepository = new AddressRepository();
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

router.get('/', asyncHandler(addressController.getAllAddress));

export default router;
