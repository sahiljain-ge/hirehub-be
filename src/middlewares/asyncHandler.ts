import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler<T = unknown> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

const asyncHandler =
  <T = unknown>(fn: AsyncRequestHandler<T>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
