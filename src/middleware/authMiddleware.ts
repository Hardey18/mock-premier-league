import { Response, NextFunction } from "express";

import { verifyToken } from "../utils/token";

export const auth = async (req: any, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  try {
    if (authorization === undefined) {
      res.status(400).send({
        status: "error",
        method: req.method,
        message: "No auth",
      });
      return;
    }
    const token = authorization.split(" ")[1];

    if (!token || token === "") {
      res.status(400).send({
        status: "error",
        method: req.method,
        message: "Access denied",
      });
      return;
    }
    const decode = verifyToken(token);
    req.user = decode;
    return next();
  } catch (error: any) {
    return res.status(400).send({
      status: "error",
      method: req.method,
      message: `Authorization failed`,
      error: error.message,
    });
  }
};

export const adminAuth = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  try {
    if (authorization === undefined) {
      res.status(400).send({
        status: "error",
        method: req.method,
        message: "No auth",
      });
      return;
    }
    const token = authorization.split(" ")[1];
    
    if (!token || token === "") {
      res.status(400).send({
        status: "error",
        method: req.method,
        message: "Access denied",
      });
      return;
    }
    const decode = verifyToken(token);
    if (decode.role !== "ADMIN") {
      res.status(400).send({
        status: "error",
        method: req.method,
        message: "You are not an ADMIN",
      });
      return;
    }
    req.user = decode;
    return next();
  } catch (error: any) {
    return res.status(400).send({
      status: "error",
      method: req.method,
      message: `Authorization failed`,
      error: error.message,
    });
  }
};
