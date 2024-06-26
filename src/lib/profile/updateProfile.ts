import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Document, Model } from "mongoose";
import { negativeResponse, positiveResponse } from "../response/response";

interface ProfileOption {
  required?: string[];
}

export const updateProfile = (
  model: Model<Document>,
  options: ProfileOption = {}
) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { fieldId } = req.params;

    const reqBody = req.body;

    if (options.required) {
      for (const key in reqBody) {
        if (!options.required.includes(key)) {
          return negativeResponse(res, `${key}, invalid field`);
        }
      }
    }

    if (reqBody.email) {
      const check = await model.findOne({
        email: reqBody.email,
        _id: { $ne: fieldId },
      });
      if (check) return negativeResponse(res, "Email already used");
    }

    const user = await model.findByIdAndUpdate(fieldId, reqBody);

    if (!user) negativeResponse(res, "User not found");
    else positiveResponse(res, `${model.modelName} profile is updated`);
  });
};
