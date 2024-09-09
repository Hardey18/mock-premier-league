import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import Team from "../model/team";
import { client } from "../config/redis";

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private by ADMIN
const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const { name, code, stadium, website, manager } = req.body;

  const team = await Team.create({
    name,
    code,
    stadium,
    website,
    manager,
  });

  if (team) {
    res.status(201).json({
      status: "success",
      method: req.method,
      _id: team._id,
      message: `${team.name} created successfully!`,
    });
  } else {
    res.status(400);
    throw new Error("Error creating team");
  }
});

// @desc    Remove a team
// @route   DELETE /api/teams/delete/:teamId
// @access  Private by ADMIN
const removeTeam = asyncHandler(async (req: Request, res: Response) => {
  const team = await Team.findByIdAndDelete(req.params.teamId);

  if (!team) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Team with the ID - ${req.params.teamId} does not exist!`,
    });
    return;
  }
  if (team) {
    res.status(201).json({
      status: "success",
      method: req.method,
      message: `${team.name} deleted successfully!`,
    });
  } else {
    res.status(400);
    throw new Error("Error deleting team");
  }
});

// @desc    Update a team
// @route   PUT /api/teams/update/:teamId
// @access  Private by ADMIN
const updateTeam = asyncHandler(async (req: Request, res: Response) => {
  const { name, code, stadium, website, manager } = req.body;
  const team = await Team.findById(req.params.teamId);

  if (!team) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Team with the ID - ${req.params.teamId} does not exist!`,
    });
    return;
  }
  if (team) {
    await Team.findByIdAndUpdate(req.params.teamId, {
      name,
      code,
      stadium,
      website,
      manager,
    });
    res.status(201).json({
      status: "success",
      method: req.method,
      message: `Team with ID - ${req.params.teamId} updated successfully!`,
    });
  } else {
    res.status(400);
    throw new Error("Error updating team");
  }
});

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
const getTeams = asyncHandler(async (req: any, res: any) => {
  const cachedTeamsData = await client.get("teams");

  if (cachedTeamsData) {
    const teams = JSON.parse(cachedTeamsData);
    return res.json({
      status: "success",
      method: req.method,
      message: "All teams returned successfully from cache",
      data: teams,
    });
  } else {
    const teams = await Team.find();

    await client.set("teams", JSON.stringify(teams), {
      EX: process.env.DEFAULT_EXPIRATION as unknown as number,
    });

    return res.json({
      status: "success",
      method: req.method,
      message: "All teams returned successfully from database",
      data: teams,
    });
  }
});

// @desc    Get single team by ID
// @route   GET /api/teams/:teamId
// @access  Private
const getTeam = asyncHandler(async (req: Request, res: Response) => {
  const team = await Team.findById(req.params.teamId);

  if (!team) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `Team with the ID - ${req.params.teamId} does not exist!`,
    });
    return;
  }
  res.json({
    status: "success",
    method: req.method,
    message: `Team with ID - ${req.params.teamId} returned successfully`,
    data: team,
  });
});

// @desc    Search for teams
// @route   GET /api/teams/search
// @access  Private
const searchTeams = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query as any;
  const team = await Team.find({ $text: { $search: query } });

  if (!team) {
    res.status(400).json({
      status: "error",
      method: req.method,
      message: `No teams!`,
    });
    return;
  }
  res.json({
    status: "success",
    method: req.method,
    message: `Teams returned successfully`,
    data: team,
  });
});

export { createTeam, getTeams, removeTeam, updateTeam, getTeam, searchTeams };
