import { Router } from "express";

import { adminAuth, auth } from "../middleware/authMiddleware";
import {
  createTeam,
  getTeam,
  getTeams,
  removeTeam,
  searchTeams,
  updateTeam,
} from "../controllers/team";

const router = Router();

/* GET team routes. */
router.route("/").get(auth, getTeams);
router.route("/:teamId").get(auth, getTeam);
router.route("/search/teams").get(searchTeams);

/* POST team routes. */
router.route("/create").post(adminAuth, createTeam);

/* PUT team routes. */
router.route("/update/:teamId").put(adminAuth, updateTeam);

/* DELETE team routes. */
router.route("/delete/:teamId").delete(adminAuth, removeTeam);

export default router;
