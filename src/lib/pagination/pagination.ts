import { Request } from "express";
import { Document, Model as MongooseModel, PopulateOptions } from "mongoose";
// import { negativeResponse } from "../response/response";

interface PaginationOptions {
  populate?: string | PopulateOptions;
  populate2?: string | PopulateOptions;
  select?: string | object;
}

// interface AnyType {
//   [key: string]: any;
// }

export const pagination = async <T extends Document>(
  req: Request,
  model: MongooseModel<T>,
  query: object,
  options: PaginationOptions = {}
) => {
  try {
    let page = 1;
    let limit = 10;
    const total = await model.countDocuments(query);

    // Check if there is page in query
    if (req.query.page) {
      page = parseInt(req.query.page as string);
    }

    // Check if there is limit in query
    if (req.query.limit) {
      limit = parseInt(req.query.limit as string);
    }

    // Set now
    const now = page;
    const totalPage = Math.ceil(total / limit);

    // Set skip
    const skip = (page - 1) * limit;
    const pagination: { prev?: number; next?: number } = {};

    if (page > 1) {
      pagination.prev = now - 1;
    }

    if (total > page * limit) {
      pagination.next = now + 1;
    }

    let dataQuery: any = model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      dataQuery = dataQuery.populate(options.populate);
    }

    if (options.populate2) {
      dataQuery = dataQuery.populate(options.populate2);
    }

    if (options.select) {
      dataQuery = dataQuery.select(options.select);
    }

    const data = await dataQuery.exec();

    return {
      data,
      totalPage,
      total,
    };
  } catch (error) {
    console.log("error occur");
  }
};
