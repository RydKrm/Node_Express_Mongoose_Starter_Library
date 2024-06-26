import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Document, Model as MongooseModel } from "mongoose";
import { negativeResponse, positiveResponse } from "../response/response";

interface Options {
  required?: string[];
  checker?: string[];
}

interface CheckerObject {
  [key: string]: any;
}

export const create = (
  Model: MongooseModel<Document>,
  options: Options = {}
) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const bodyObject = req.body; // Assuming any type for req.body, adjust as per your schema

    if (options.required) {
      for (const item of options.required) {
        if (!bodyObject[item]) {
          return negativeResponse(res, `${item} field is required`);
        }
      }
    }

    if (options.checker) {
      const checker: string[] = options.checker;
      const checkerObject: CheckerObject = {};
      for (const item of checker) {
        if (bodyObject[item]) {
          checkerObject[item] = bodyObject[item];
        }
      }
      const keys = Object.keys(checkerObject);
      const values = Object.values(checkerObject);
      const checkCount = await Model.countDocuments({
        $or: keys.map((key, index) => ({ [key]: values[index] })),
      });
      if (checkCount > 0) {
        return negativeResponse(
          res,
          `Field already exists by ${checker.join(" or ")}`
        );
      }
    }

    const data = await Model.create(bodyObject);

    positiveResponse(res, `${Model.modelName} created`, { data });
  });
};
