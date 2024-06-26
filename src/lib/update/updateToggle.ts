import { Document, Model } from "mongoose";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { negativeResponse, positiveResponse } from "../response/response";

export const updateToggle = (Model: Model<Document>, field: string) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { fieldId } = req.params;
    const data = await Model.findById(fieldId);
    if (data) {
      data[field] = !data[field];
      await data.save();
      positiveResponse(res, "Field Updated");
    } else negativeResponse(res, "Data not found by _id");
  });
};
