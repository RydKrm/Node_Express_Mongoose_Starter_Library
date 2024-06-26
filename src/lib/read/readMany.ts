import { Document, Model, PopulateOptions } from "mongoose";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { pagination } from "../pagination/pagination";
import { positiveResponse } from "../response/response";

interface ReadManyOption {
  pagination?: boolean;
  select?: string | string[];
  populate?: PopulateOptions;
  populate2?: PopulateOptions;
  query?: object;
}

export const readMany = (
  Model: Model<Document>,
  options: ReadManyOption = {}
) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const query = options.query || {};
    // pagination type
    if (options.pagination) {
      const list = await pagination(req, Model, query, {
        select: options.select,
        populate: options.populate,
        populate2: options.populate2,
      });
      return positiveResponse(res, "Item list ", {
        list: list?.data,
        totalDoc: list?.total,
        totalPage: list?.totalPage,
      });
    }

    // generale get

    let field = Model.find(query);

    if (options.select) field = field.select(options.select);

    if (options.populate) field = field.populate(options.populate);

    if (options.populate2) field = field.populate(options.populate2);

    const data = await field.exec();

    positiveResponse(res, "Data found ", { data });
  });
};
