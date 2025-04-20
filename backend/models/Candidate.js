import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'Selected', 'Rejected', 'Ongoing', 'Scheduled'],
      default: 'New',
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
