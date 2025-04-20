import express from "express";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidateStatus,
  deleteCandidate,
  downloadResume,
} from "../controllers/candidateController.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("resume"), createCandidate)
  .get(getAllCandidates);

router
  .route("/:id")
  .get(getCandidateById)
  .put(updateCandidateStatus)
  .delete(deleteCandidate);

router.get("/download/:fileName", downloadResume);
export default router;
