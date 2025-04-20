import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res, next) => {
  try {
    const { employeeId, status } = req.body;

    const existing = await Attendance.findOne({ employee: employeeId });

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      status,
    });
    res.status(201).json(attendance);
  } catch (err) {
    next(err);
  }
};

export const getAllAttendance = async (req, res, next) => {
  try {
    const attendances = await Attendance.find()
      .populate("employee", "fullName position department")
      .sort({ updatedAt: -1 });
    res.json(attendances);
  } catch (err) {
    next(err);
  }
};

export const getAttendanceByEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const records = await Attendance.find({ employee: employeeId })
      .populate("employee", "fullName position")
      .sort({ updatedAt: -1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Attendance deleted" });
  } catch (err) {
    next(err);
  }
};
