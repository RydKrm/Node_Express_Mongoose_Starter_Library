import { Document, Model, PopulateOptions } from "mongoose";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { negativeResponse, positiveResponse } from "../response/response";

interface SingleOptions {
  select?: string;
  populate?: PopulateOptions;
  populate2?: PopulateOptions;
}

export const readSingle = (
  Model: Model<Document>,
  options: SingleOptions = {}
) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { fieldId } = req.body;

    let field = Model.findById(fieldId);

    if (options.select) {
      field = field.select(options.select);
    }

    if (options.populate) {
      field = field.populate(options.populate);
    }

    if (options.populate2) {
      field = field.populate(options.populate2);
    }

    const data = await field.exec();

    if (!data) return negativeResponse(res, "Data not found by _id");

    positiveResponse(res, "Data Found ", { data });
  });
};
