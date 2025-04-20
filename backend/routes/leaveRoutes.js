import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

router.get("/", getAllLeaves);
router.patch("/:id", updateLeaveStatus);
router.delete("/:id", deleteLeave);
router.post("/", upload.single("document"), applyLeave);


export default router;