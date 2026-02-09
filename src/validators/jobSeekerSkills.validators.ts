import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

type RequestPart = "body" | "params" | "query";

export const validateJobSeekerSkillsData =
    (schema: ZodSchema, part: RequestPart) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsed = schema.parse(req[part]);
                req[part] = parsed;   // convert to the desired type like number according to  the schema
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Validation failed",
                        errors: error.issues.map(({ message, path }) => ({
                            path: path.join("."),
                            issue: message,
                        })),
                    });
                }
                next(error);
            }
        };
