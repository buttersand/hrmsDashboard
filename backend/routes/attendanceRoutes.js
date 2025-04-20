import express from "express";
import {
  markAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
  deleteAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/mark", markAttendance);
router.get("/", getAllAttendance);
router.get("/:id", getAttendanceByEmployee);
router.delete("/:id", deleteAttendance);

export default router;
