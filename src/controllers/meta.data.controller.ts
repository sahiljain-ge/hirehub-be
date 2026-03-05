import { Request, Response } from "express";
import MetaDataService from "../services/meta.data.service.js";
import { sendSuccess } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";

class MetaDataController {
  constructor (private readonly metaDataService: MetaDataService) {}

  getMetaData = async (req: Request, res: Response) => {
    const metaData = await this.metaDataService.getMetaData();

    return sendSuccess(res, metaData, 'Successfully retreived meta data', StatusCodes.OK);
  }

}

export default MetaDataController