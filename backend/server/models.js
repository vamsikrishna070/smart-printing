import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["student", "staff"], default: "student" },
});

// Print Job Schema
const printJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  copies: { type: Number, default: 1 },
  printType: { type: String, enum: ["bw", "color"], required: true },
  status: { type: String, enum: ["pending", "printing", "ready", "completed"], default: "pending" },
  queueNumber: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
export const PrintJob = mongoose.model("PrintJob", printJobSchema);
