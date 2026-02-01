import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env") });

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/printqueue";

console.log("Connecting to database:", DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// Connect to MongoDB
mongoose.connect(DATABASE_URL)
.then(() => console.log("✓ Connected to MongoDB successfully"))
.catch((err) => {
  console.error("✗ MongoDB connection error:", err.message);
  console.log("⚠ Running with memory storage - data will not persist");
});

export const db = mongoose.connection;
