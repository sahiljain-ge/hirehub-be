import AddressRepository from '../repositories/address.repository.js';

class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}
  async getAllAddress() {
    return await this.addressRepository.getAll();
  }
}

export default AddressService;
