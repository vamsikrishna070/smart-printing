import { User, PrintJob } from "./models.js";
import mongoose from "mongoose";

// In-memory storage for when MongoDB is not connected
class MemoryStorage {
  constructor() {
    this.users = [];
    this.printJobs = [];
    this.userIdCounter = 1;
    this.jobIdCounter = 1;
  }

  async getUser(id) {
    return this.users.find(u => u._id === id) || null;
  }

  async getUserByUsername(username) {
    return this.users.find(u => u.username === username) || null;
  }

  async createUser(insertUser) {
    const user = {
      _id: String(this.userIdCounter++),
      ...insertUser,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id, updates) {
    const user = this.users.find(u => u._id === id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  }

  async getUserById(id) {
    return this.users.find(u => u._id === id) || null;
  }

  async createPrintJob(job) {
    const estimatedTime = Math.ceil(job.copies / 5) + 1;
    const queueNumber = this.printJobs.length + 1;

    const newJob = {
      _id: String(this.jobIdCounter++),
      ...job,
      queueNumber,
      estimatedTime,
      status: "pending",
      createdAt: new Date(),
    };
    
    this.printJobs.push(newJob);
    return newJob;
  }

  async getPrintJobs() {
    const user = this.users.find(u => u._id === job.userId);
    return this.printJobs.map(job => ({
      ...job,
      id: job._id,
      user: this.users.find(u => u._id === job.userId) || { username: 'unknown', name: 'Unknown', role: 'student' }
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getPrintJobsByUser(userId) {
    const user = this.users.find(u => u._id === userId);
    return this.printJobs
      .filter(job => job.userId === userId)
      .map(job => ({
        ...job,
        id: job._id,
        user: user || { username: 'unknown', name: 'Unknown', role: 'student' }
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getPrintJob(id) {
    return this.printJobs.find(job => job._id === id) || null;
  }

  async getPrintJobByFilePath(filePath) {
    return this.printJobs.find(job => job.filePath === filePath) || null;
  }

  async updatePrintJobStatus(id, status) {
    const validStatuses = ["pending", "printing", "ready", "completed"];
    if (!validStatuses.includes(status)) return undefined;

    const job = this.printJobs.find(job => job._id === id);
    if (!job) return null;
    job.status = status;
    return job;
  }
}

export class DatabaseStorage {
  async getUser(id) {
    return await User.findById(id).lean();
  }

  async getUserByUsername(username) {
    return await User.findOne({ username }).lean();
  }

  async createUser(insertUser) {
    const user = new User(insertUser);
    await user.save();
    return user.toObject();
  }

  async updateUser(id, updates) {
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
    return user;
  }

  async getUserById(id) {
    return await User.findById(id).lean();
  }

  async createPrintJob(job) {
    // Calculate estimated time: 1 min per 5 copies + 1 min base
    const estimatedTime = Math.ceil(job.copies / 5) + 1;
    
    // Get next queue number
    const count = await PrintJob.countDocuments();
    const queueNumber = count + 1;

    const newJob = new PrintJob({
      ...job,
      queueNumber,
      estimatedTime,
      status: "pending",
      createdAt: new Date(),
    });
    
    await newJob.save();
    return newJob.toObject();
  }

  async getPrintJobs() {
    return await PrintJob.find()
      .populate('userId', 'username name role')
      .sort({ createdAt: -1 })
      .lean()
      .then(jobs => jobs.map(job => ({
        ...job,
        id: job._id.toString(),
        userId: job.userId._id.toString(),
        user: job.userId
      })));
  }

  async getPrintJobsByUser(userId) {
    return await PrintJob.find({ userId })
      .populate('userId', 'username name role')
      .sort({ createdAt: -1 })
      .lean()
      .then(jobs => jobs.map(job => ({
        ...job,
        id: job._id.toString(),
        userId: job.userId._id.toString(),
        user: job.userId
      })));
  }

  async getPrintJob(id) {
    return await PrintJob.findById(id).lean();
  }

  async getPrintJobByFilePath(filePath) {
    return await PrintJob.findOne({ filePath }).lean();
  }

  async updatePrintJobStatus(id, status) {
    const validStatuses = ["pending", "printing", "ready", "completed"];
    if (!validStatuses.includes(status)) return undefined;

    const updated = await PrintJob.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    
    return updated;
  }
}

// Use memory storage if MongoDB is not connected, otherwise use DatabaseStorage
const isMongoConnected = () => mongoose.connection.readyState === 1;
const memoryStorage = new MemoryStorage();
const dbStorage = new DatabaseStorage();

export const storage = new Proxy({}, {
  get(target, prop) {
    const storageImpl = isMongoConnected() ? dbStorage : memoryStorage;
    return storageImpl[prop]?.bind(storageImpl);
  }
});
