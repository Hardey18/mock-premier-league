import { Document } from "mongoose";

export interface UserDataType {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
};

export interface JwtPayload {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  iat?: number;
};

export interface IFixture extends Document {
  homeTeam: string;
  awayTeam: string;
  homeCode: string;
  awayCode: string;
  homeScore: number;
  awayScore: number;
  stadium: string;
  matchCode: string;
  season: string;
  status: string;
}

export interface ITeam extends Document {
  name: string;
  code: string;
  stadium: string;
  website: string;
  manager: string;
}

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  password: string;
}
