import jwt from "jsonwebtoken";
import { JwtPayload, UserDataType } from "./typings";

export const generateToken = (data: UserDataType) => {
  return jwt.sign(data, process.env.JWT_PRIVATE_KEY as string);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_PRIVATE_KEY as string) as JwtPayload;
};
