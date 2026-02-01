import { storage } from "./storage.js";
import { db } from "./db.js";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  console.log("Seeding database...");

  // Wait for database connection
  await new Promise((resolve) => {
    if (db.readyState === 1) resolve();
    else db.once('open', resolve);
  });

  // Drop old email index if it exists
  try {
    const User = (await import('./models.js')).User;
    await User.collection.dropIndex('email_1');
    console.log("Dropped old email index");
  } catch (err) {
    // Index might not exist, that's okay
  }

  const existingStaff = await storage.getUserByUsername("staff");
  if (!existingStaff) {
    const hashedPassword = await hashPassword("staff123");
    await storage.createUser({
      username: "staff",
      password: hashedPassword,
      name: "Stationery Staff",
      role: "staff",
    });
    console.log("Created staff user: staff / staff123");
  }

  const existingStudent = await storage.getUserByUsername("student");
  if (!existingStudent) {
    const hashedPassword = await hashPassword("student123");
    await storage.createUser({
      username: "student",
      password: hashedPassword,
      name: "John Student",
      role: "student",
    });
    console.log("Created student user: student / student123");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
