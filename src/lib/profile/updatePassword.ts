import { Document, Model } from "mongoose";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { negativeResponse, positiveResponse } from "../response/response";
import bcrypt from "bcrypt";

interface UserInterface extends Document {
  password: string;
}

export const updatePassword = (model: Model<UserInterface>) => {
  return asyncHandler(async (req: Request, res: Response) => {
    const { fieldId } = req.body;

    //   required old password and new password and _id to update the field
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return negativeResponse(res, "Old and new password required");

    // find the user by _id
    const user = await model.findById(fieldId);
    if (!user) return negativeResponse(res, "User not found by _id");

    //   compare the password with previous password
    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      negativeResponse(res, "Old password did not match ");
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await model.findByIdAndUpdate(fieldId, { password: hashedPassword });
      positiveResponse(res, "Password updated");
    }
  });
};
