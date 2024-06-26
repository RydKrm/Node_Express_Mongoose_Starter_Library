import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { pagination } from "../pagination/pagination";
import { positiveResponse, negativeResponse } from "../response/response";
import { Model, Document, PopulateOptions } from "mongoose";

interface ReadOptions {
  query?: object;
  pagination?: boolean;
  select?: string;
  populate?: PopulateOptions;
  fieldQuery?: boolean;
  fieldKey?: string;
  dynamicQuery?: string[];
}

// interface PaginatedResult {
//   data: Document[];
//   total: number;
// }

export const read = (Model: Model<Document>, option: ReadOptions = {}) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const query = option.query || {};

    // for pagination read
    if (option.pagination) {
      const list = await pagination(req, Model, query, {
        select: option?.select,
        populate: option?.populate,
      });
      return positiveResponse(res, "Item list", {
        list: list?.data,
        totalDoc: list?.total,
      });
    }

    if (option.fieldQuery && option.fieldKey) {
      const { fieldId } = req.params;
      const fieldKey: string = option.fieldKey;
      const fQuery = {
        [fieldKey]: fieldId,
      };
      const list = await Model.find(fQuery)
        .select(option.select || "")
        .populate(option.populate || []);
      return positiveResponse(res, "Data list by field", { list });
    }

    if (option.dynamicQuery) {
      const dQuery: { [key: string]: any } = {};
      for (const item of option.dynamicQuery) {
        if (req.body[item]) {
          dQuery[item] = req.body[item];
        } else {
          return negativeResponse(
            res,
            `${option.dynamicQuery} field is required`
          );
        }
      }
      const list = await Model.find(dQuery)
        .select(option.select || "")
        .populate(option.populate || []);
      return positiveResponse(res, "Data list", { list });
    }

    const { fieldId } = req.params;

    // For find by _id
    if (!fieldId) {
      const data = await Model.find(query)
        .select(option.select || "")
        .populate(option.populate || []);

      return positiveResponse(res, "Data found", { data });
    } else {
      // For query parameter
      const data = await Model.findById(fieldId)
        .select(option.select || "")
        .populate(option.populate || []);
      if (!data) return negativeResponse(res, "Data not found");
      else return positiveResponse(res, "Data found", { data });
    }
  });
};
