import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Document, Model as MongooseModel } from "mongoose";
import { negativeResponse, positiveResponse } from "../response/response";

export const deleteDate = (Model: MongooseModel<Document>) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { fieldId } = req.params;
    const data = await Model.findByIdAndDelete(fieldId);
    if (data) positiveResponse(res, "Data Deleted");
    else negativeResponse(res, "Data not found by _id");
  });
};
