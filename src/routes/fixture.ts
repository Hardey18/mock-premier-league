import { Router } from "express";
import { adminAuth, auth } from "../middleware/authMiddleware";
import {
  createFixture,
  getFixture,
  getFixtureByStatus,
  removeFixture,
  searchFixtures,
  updateFixture,
  updateScore,
} from "../controllers/fixture";

const router = Router();

/* GET fixture routes. */
router.route("/:fixtureStatus").get(auth, getFixtureByStatus);
router.route("/search/fixtures").get(searchFixtures);
router.route("/single/:fixtureId").get(getFixture);

/* POST fixture routes. */
router.route("/create").post(adminAuth, createFixture);

/* PUT fixture routes. */
router.route("/score/:fixtureId").put(adminAuth, updateScore);
router.route("/update/:fixtureId").put(adminAuth, updateFixture);

/* DELETE fixture routes. */
router.route("/delete/:fixtureId").delete(adminAuth, removeFixture);

export default router;
