import { Response } from "express";

const successResponse = (response: Response, statsCode: number, body: any) => {
  return response.status(statsCode).send({
    success: true,
    code: statsCode,
    ...body,
  });
};

const errorResponse = (response: Response, statsCode: number, message: any) => {
  return response.status(statsCode).send({
    success: false,
    code: statsCode,
    message,
  });
};

export { successResponse, errorResponse };