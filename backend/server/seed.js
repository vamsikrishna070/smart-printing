import { storage } from "./storage.js";
import { db } from "./db.js";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import readline from "readline";

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function seed() {
  console.log("=== Create Staff Account ===\n");

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

  const username = await question("Enter staff username: ");
  
  const existingStaff = await storage.getUserByUsername(username);
  if (existingStaff) {
    console.log("\n❌ User already exists!");
    rl.close();
    process.exit(1);
  }

  const password = await question("Enter staff password: ");
  const name = await question("Enter staff name: ");
  const phone = await question("Enter staff phone (optional): ");

  const hashedPassword = await hashPassword(password);
  await storage.createUser({
    username,
    password: hashedPassword,
    name,
    phone: phone || undefined,
    role: "staff",
  });
  
  console.log(`\n✓ Staff user created successfully!`);
  console.log(`Username: ${username}`);
  console.log(`Role: staff`);
  
  rl.close();

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
