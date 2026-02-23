import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CompanyService from '../services/company.service.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseFormatter.js';

class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  createCompany = async (req: Request, res: Response) => {
    const company = await this.companyService.createCompany(req.user!.id, req.body);
    return sendSuccess(res, company, 'Company created', StatusCodes.CREATED);
  };

  getCompanyProfile = async (req: Request, res: Response) => {
    const company = await this.companyService.getCompanyProfile(req.user!.id);
    return sendSuccess(res, company, 'Company profile', StatusCodes.OK);
  };

  updateCompanyProfile = async (req: Request, res: Response) => {
    const company = await this.companyService.updateCompanyProfile(req.user!.id, req.body);
    return sendSuccess(res, company, 'Company updated', StatusCodes.OK);
  };

  updateCompanyLogo = async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError('Logo file is required', StatusCodes.BAD_REQUEST);
    }

    const company = await this.companyService.updateCompanyLogo(req.user!.id, req.file);

    return sendSuccess(res, { logo_url: company.logo_url }, 'Logo updated', StatusCodes.OK);
  };
}

export default CompanyController;
