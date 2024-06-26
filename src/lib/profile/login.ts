import { Document, Model as MongooseModel } from "mongoose";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { negativeResponse, positiveResponse } from "../response/response";
import jwt from "jsonwebtoken";

export const login = (Model: MongooseModel<Document>, role: string) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
      return negativeResponse(res, "Email and password required");
    const user = await Model.findOne({ email });

    if (!user) return negativeResponse(res, "Profile not found");

    //   create token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.TOKEN_SECRET as string
    );

    positiveResponse(res, "Log in Successfully", {
      token,
      role,
      _id: user._id,
    });
  });
};
