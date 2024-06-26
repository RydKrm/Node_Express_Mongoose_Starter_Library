import { Response } from "express";

export const negativeResponse = (res: Response, message: string) => {
  res.status(400).json({
    success: true,
    message,
  });
};

interface optionInterface {
  [key: string]: any;
}

// option take any kind of object here so we need to define object key will be string type and value will be any kind

export const positiveResponse = (
  res: Response,
  message: string,
  option: optionInterface = {}
): void => {
  const object = {
    success: true,
    message,
  };

  for (const key in option) {
    object[key] = option[key];
  }
  res.status(200).json(object);
};
