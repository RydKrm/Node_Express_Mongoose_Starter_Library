import { Document, Model } from "mongoose";
import asyncHandler from "express-async-handler";
import { negativeResponse, positiveResponse } from "../response/response";
import { Request, Response } from "express";

interface UpdateOptions {
  required?: string[];
  setData?: object;
  notUpdate?: string[];
  checker?: string[];
}

export const update = (Model: Model<Document>, options: UpdateOptions = {}) => {
  return asyncHandler(async (req: Request, res: Response) => {
    let bodyObject = req.body;

    // Checking empty field
    if (Object.keys(bodyObject).length === 0 && !options.setData)
      return negativeResponse(res, "Empty field not allowed");

    const { fieldId } = req.params;

    if (options.required) {
      for (const item of options.required) {
        if (!bodyObject[item]) {
          return negativeResponse(
            res,
            `${options.required} fields are required`
          );
        }
      }

      for (const key in bodyObject) {
        if (!options.required.includes(key)) {
          return negativeResponse(res, "Extra field found");
        }
      }
    }

    if (options.notUpdate) {
      for (const key in bodyObject) {
        if (options.notUpdate.includes(key)) {
          return negativeResponse(
            res,
            `${options.notUpdate.join(",")} can not updated`
          );
        }
      }
    }

    // Check if any object value already exists in the db or not
    if (options.checker) {
      const checkerObject = {};
      for (const item of options.checker) {
        if (bodyObject[item]) {
          checkerObject[item] = bodyObject[item];
        }
      }
      if (Object.keys(checkerObject).length > 0) {
        const keys = Object.keys(checkerObject);
        const values = Object.values(checkerObject);
        const checkCount = await Model.countDocuments({
          $or: keys.map((key, index) => ({ [key]: values[index] })),
        });
        if (checkCount > 0) {
          return negativeResponse(
            res,
            `Field already exists by ${options.checker.join(" or ")}`
          );
        }
      }
    }

    if (options.setData) {
      bodyObject = options.setData;
    }

    // Update field
    const data = await Model.findByIdAndUpdate(fieldId, bodyObject);
    if (data) positiveResponse(res, "Field updated");
    else negativeResponse(res, "Data not found by _id");
  });
};
