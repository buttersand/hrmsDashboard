import Leave from "../models/Leave.js";

export const applyLeave = async (req, res, next) => {
  try {
    const documentPath = req.file ? req.file.path : null;

    const newLeave = new Leave({
      ...req.body,
      document: documentPath,
    });

    const saved = await newLeave.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find().populate(
      "employee",
      "fullName position department"
    );
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

export const updateLeaveStatus = async (req, res, next) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json(leave);
  } catch (err) {
    next(err);
  }
};

export const deleteLeave = async (req, res, next) => {
  try {
    const deleted = await Leave.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Leave not found" });
    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    next(err);
  }
};
