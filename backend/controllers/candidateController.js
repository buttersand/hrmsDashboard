import Candidate from "../models/Candidate.js";
import fs from "fs";
import path from "path";

export const createCandidate = async (req, res, next) => {
  try {
    const { name, email, phone, jobRole, experience } = req.body;
    const resumeUrl = req.file ? req.file.filename : null;

    if (!resumeUrl) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const newCandidate = await Candidate.create({
      name,
      email,
      phone,
      jobRole,
      experience,
      resumeUrl,
    });

    res.status(201).json(newCandidate);
  } catch (error) {
    next(error);
  }
};

export const getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (error) {
    next(error);
  }
};

export const updateCandidateStatus = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    candidate.status = req.body.status || candidate.status;
    await candidate.save();

    res.json(candidate);
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    const filePath = path.join("uploads", candidate.resumeUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted" });
  } catch (error) {
    next(error);
  }
};

export const downloadResume = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(path.resolve(), "uploads", fileName);

  if (fs.existsSync(filePath)) {
    return res.download(filePath);
  } else {
    return res.status(404).json({ message: "File not found" });
  }
};
