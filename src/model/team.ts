import mongoose, { Document, Schema } from "mongoose";
import { ITeam } from "../utils/typings";

const teamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    stadium: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: true,
      unique: true,
    },
    manager: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({
  name: "text",
  code: "text",
  stadium: "text",
  website: "text",
  manager: "text",
});

const Team = mongoose.model<ITeam>("Team", teamSchema);

export default Team;
