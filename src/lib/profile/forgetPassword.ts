import asyncHandler from "express-async-handler";
import { Document, Model as MongooseModel } from "mongoose";
import { negativeResponse, positiveResponse } from "../response/response";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

interface Profile extends Document {
  _id: string;
  role: string;
}

export const forgetPassword = (Model: MongooseModel<Profile>) => {
  return asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (email) {
      return negativeResponse(res, "Email required");
    }

    const profile = await Model.findOne({ email });
    if (!profile) return negativeResponse(res, "Profile not found by email");

    const token = jwt.sign(
      { _id: profile._id, role: profile.role },
      process.env.TOKEN_SECRET as string
    );

    positiveResponse(res, "Update Password sent to the email", { token });
  });
};
