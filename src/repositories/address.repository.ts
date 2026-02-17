import db from '../config/prisma.js';

class AddressRepository {
  async getAll() {
    try {
      return await db.addresses.findMany();
    } catch (error) {
      throw error;
    }
  }
}
export default AddressRepository;
