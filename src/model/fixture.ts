import mongoose, { Document, Schema } from "mongoose";
import { IFixture } from "../utils/typings";

const fixtureSchema = new Schema(
  {
    homeTeam: {
      type: String,
    },
    awayTeam: {
      type: String,
    },
    homeCode: {
      type: String,
      required: true,
    },
    awayCode: {
      type: String,
      required: true,
    },
    homeScore: {
      type: Number,
      default: null,
    },
    awayScore: {
      type: Number,
      default: null,
    },
    stadium: {
      type: String,
    },
    matchCode: {
      type: String,
    },
    matchDate: {
      type: Date,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

fixtureSchema.index({
  homeTeam: "text",
  awayTeam: "text",
  homeCode: "text",
  awayCode: "text",
  stadium: "text",
  matchCode: "text",
  season: "text",
  status: "text",
});

const Fixture = mongoose.model<IFixture>("Fixture", fixtureSchema);

export default Fixture;
