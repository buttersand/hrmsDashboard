import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Medical Leave", "Work from Home"],
    default: "Present",
  },
  task: {
    type: String,
    required: false, 
    trim: true
  },
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
