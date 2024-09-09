import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import Team from "../model/team";
import Fixture from "../model/fixture";
import { seasonFormat } from "../utils";
import { client } from "../config/redis";

// @desc    Create a new fixture
// @route   POST /api/fixtures
// @access  Private by ADMIN
const createFixture = asyncHandler(async (req: Request, res: Response) => {
  const { homeCode, awayCode, matchDate, season } = req.body;

  const homeTeam = await Team.findOne({ code: homeCode.toUpperCase() });
  const awayTeam = await Team.findOne({ code: awayCode.toUpperCase() });
  const fixtureBySeason = await Fixture.find({ season });
  const checkExistingFixtureBySeason = fixtureBySeason.filter(
    (fixture) =>
      fixture.matchCode ===
      `#${homeCode.toUpperCase()}${awayCode.toUpperCase()}`
  );

  if (!homeTeam) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Home team with the code - ${homeCode} does not exist!`,
    });
    return;
  }

  if (!awayTeam) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Away team with the code - ${awayCode} does not exist!`,
    });
    return;
  }

  if (homeCode.toUpperCase() === awayCode.toUpperCase()) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `You can't create a fixture with same team!`,
    });
    return;
  }

  if (checkExistingFixtureBySeason.length > 0) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Fixture between ${homeTeam.name} and ${awayTeam.name} for season ${season} already exist!`,
    });
    return;
  }

  if (seasonFormat(season) === false) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Wrong season format. Should follow this format - "YYYY/YYYY"!`,
    });
    return;
  }

  const newFixture = await Fixture.create({
    homeTeam: homeTeam.name,
    awayTeam: awayTeam.name,
    homeCode: homeCode.toUpperCase(),
    awayCode: awayCode.toUpperCase(),
    stadium: homeTeam.stadium,
    matchCode: `#${homeCode.toUpperCase()}${awayCode.toUpperCase()}`,
    matchDate,
    season,
  });

  res.status(201).json({
    status: "success",
    method: req.method,
    message: `Fixture created successfully!`,
    data: {
      fixtureData: newFixture,
      link: `${process.env.BASE_URL}fixtures/single/${newFixture._id}`,
    },
  });
});

// @desc    Remove a fixture
// @route   POST /api/fixtures/delete/:fixtureId
// @access  Private by ADMIN
const removeFixture = asyncHandler(async (req: Request, res: Response) => {
  const fixture = await Fixture.findByIdAndDelete(req.params.fixtureId);

  if (!fixture) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Fixture with the ID - ${req.params.fixtureId} does not exist!`,
    });
    return;
  }
  if (fixture) {
    res.status(201).json({
      status: "success",
      method: req.method,
      message: `${fixture.matchCode} for season ${fixture.season} deleted successfully!`,
    });
  } else {
    res.status(400);
    throw new Error("Error deleting fixture");
  }
});

// @desc    Update score for fixture
// @route   PUT /api/fixtures/score/:fixtureId
// @access  Private by ADMIN
const updateScore = asyncHandler(async (req: Request, res: Response) => {
  const { homeScore, awayScore } = req.body;
  const fixture = await Fixture.findById(req.params.fixtureId);

  if (!fixture) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Fixture with the ID - ${req.params.fixtureId} does not exist!`,
    });
    return;
  }

  if (!homeScore || !awayScore) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Home and away scores are required`,
    });
    return;
  }

  if (fixture) {
    await Fixture.findByIdAndUpdate(req.params.fixtureId, {
      homeScore,
      awayScore,
      status: "COMPLETED",
    });
    res.status(201).json({
      status: "success",
      method: req.method,
      message: `Score updated successfully!`,
    });
  } else {
    res.status(400);
    throw new Error("Error updating score");
  }
});

// @desc    Update a fixture
// @route   PUT /api/fixtures/update/:fixtureId
// @access  Private by ADMIN
const updateFixture = asyncHandler(async (req: Request, res: Response) => {
  const { homeCode, awayCode, matchDate, season } = req.body;
  const fixture = await Fixture.findById(req.params.fixtureId);

  if (!fixture) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Fixture with the ID - ${req.params.fixtureId} does not exist!`,
    });
    return;
  }

  if (seasonFormat(season) === false) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Wrong season format. Should follow this format - "YYYY/YYYY"!`,
    });
    return;
  }

  if (fixture) {
    await Fixture.findByIdAndUpdate(req.params.fixtureId, {
      homeCode,
      awayCode,
      matchDate,
      season,
    });
    res.status(201).json({
      status: "success",
      method: req.method,
      message: `Fixture with ID - ${req.params.fixtureId} updated successfully!`,
    });
  } else {
    res.status(400);
    throw new Error("Error updating fixture");
  }
});

// @desc    Get fixtures by status - "PENDING" or "COMPLETED"
// @route   GET /api/fixtures/:fixtureStatus
// @access  Private
const getFixtureByStatus = asyncHandler(async (req: Request, res: Response) => {
  const cachedFixturesData = await client.get("fixtures");

  if (
    req.params.fixtureStatus !== "COMPLETED" &&
    req.params.fixtureStatus !== "PENDING"
  ) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Invalid fixture status!`,
    });
    return;
  }

  if (cachedFixturesData) {
    const fixtures = JSON.parse(cachedFixturesData);

    let newFixture = fixtures.filter(
      (data: { status: string }) => data.status === req.params.fixtureStatus
    );

    if (newFixture.length === 0) {
      res.status(400).json({
        status: "error",
        method: req.method,
        message: `No fixtures available!`,
      });
      return;
    }

    res.json({
      status: "success",
      method: req.method,
      message: `Fixtures with status ${req.params.fixtureStatus} returned successfully`,
      data: newFixture,
    });
  } else {
    const fixtures = await Fixture.find({ status: req.params.fixtureStatus });

    if (fixtures.length === 0) {
      res.status(400).json({
        status: "error",
        method: req.method,
        message: `No fixtures available!`,
      });
      return;
    }

    await client.set("fixtures", JSON.stringify(fixtures), {
      EX: process.env.DEFAULT_EXPIRATION as unknown as number,
    });

    res.json({
      status: "success",
      method: req.method,
      message: `Fixtures with status ${req.params.fixtureStatus} returned successfully`,
      data: fixtures,
    });
  }
});

// @desc    Search for fixtures
// @route   GET /api/fixtures/search
// @access  Private
const searchFixtures = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query as any;
  const fixtures = await Fixture.find({ $text: { $search: query } });

  if (!fixtures) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `No fixtures!`,
    });
    return;
  }
  res.json({
    status: "success",
    method: req.method,
    message: `Fixtures returned successfully`,
    data: fixtures,
  });
});

// @desc    Get single fixture by ID
// @route   GET /api/fixtures/:fixtureId
// @access  Private
const getFixture = asyncHandler(async (req: Request, res: Response) => {
  const fixture = await Fixture.findById(req.params.fixtureId);

  if (!fixture) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Fixture with the ID - ${req.params.fixtureId} does not exist!`,
    });
    return;
  }
  res.json({
    status: "success",
    method: req.method,
    message: `Fixture with ID - ${req.params.fixtureId} returned successfully`,
    data: fixture,
    link: `${process.env.BASE_URL}fixtures/single/${req.params.fixtureId}`,
  });
});

export {
  createFixture,
  removeFixture,
  updateScore,
  updateFixture,
  getFixtureByStatus,
  searchFixtures,
  getFixture,
};
