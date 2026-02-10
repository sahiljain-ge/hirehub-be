import { StatusCodes } from 'http-status-codes';
import CompanyRepository from '../repositories/company.repository.js';
import AppError from '../utils/AppError.js';
import { CreateCompanyBody, UpdateCompanyBody } from '../schemas/company.schema.js';

class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async createCompany(employerId: string, payload: CreateCompanyBody) {
    const existing = await this.companyRepository.findByEmployerId(employerId);
    if (existing) {
      throw new AppError('Company profile already exists', StatusCodes.CONFLICT);
    }

    return await this.companyRepository.create(employerId, payload);
  }

  async getCompanyProfile(employerId: string) {
    const company = await this.companyRepository.findByEmployerId(employerId);
    if (!company) {
      throw new AppError('Company not found', StatusCodes.NOT_FOUND);
    }
    return company;
  }

  async updateCompanyProfile(employerId: string, payload: UpdateCompanyBody) {
    await this.getCompanyProfile(employerId);
    return await this.companyRepository.updateByEmployerId(employerId, payload);
  }

  async updateCompanyLogo(employerId: string, logoUrl: string) {
    await this.getCompanyProfile(employerId);
    return await this.companyRepository.updateLogo(employerId, logoUrl);
  }
}

export default CompanyService;
