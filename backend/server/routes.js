import express from "express";
import { setupAuth } from "./auth.js";
import { storage } from "./storage.js";
import { api } from "../../shared/routes.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(httpServer, app) {
  // Set up authentication
  setupAuth(app);

  // Serve uploaded files statically for staff to view
  app.use('/uploads', express.static(uploadDir));

  // --- Auth Routes ---
  // (Handled by setupAuth mostly, but we can add specific handlers if needed beyond passport)
  
  // --- Job Routes ---

  // LIST Jobs
  app.get(api.jobs.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const user = req.user;
    if (user.role === 'staff') {
      const jobs = await storage.getPrintJobs();
      res.json(jobs);
    } else {
      const jobs = await storage.getPrintJobsByUser(user._id);
      res.json(jobs);
    }
  });

  // CREATE Job (Upload)
  // Note: We use multer middleware here. API path defined in shared/routes
  app.post(api.jobs.create.path, upload.single('file'), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
      // Manually parse body fields since they come as strings in multipart/form-data
      const copies = parseInt(req.body.copies) || 1;
      const printType = req.body.printType === 'color' ? 'color' : 'bw';

      const job = await storage.createPrintJob({
        userId: req.user._id,
        fileName: req.file.originalname,
        filePath: req.file.filename, // Stored filename in uploads/
        copies,
        printType,
      });
      
      res.status(201).json(job);
    } catch (err) {
      console.error("Job creation error:", err);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // GET Job details
  app.get(api.jobs.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const job = await storage.getPrintJob(req.params.id);
    if (!job) return res.sendStatus(404);

    // Access control: only owner or staff
    const user = req.user;
    if (user.role !== 'staff' && job.userId.toString() !== user._id.toString()) {
      return res.sendStatus(403);
    }

    res.json(job);
  });

  // UPDATE Job Status (Staff only)
  app.patch(api.jobs.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user;
    if (user.role !== 'staff') return res.sendStatus(403);

    try {
      const { status } = api.jobs.updateStatus.input.parse(req.body);
      const updated = await storage.updatePrintJobStatus(req.params.id, status);
      
      if (!updated) return res.sendStatus(404);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid status" });
    }
  });

  // --- User Settings Routes ---

  // UPDATE Profile
  app.patch('/api/user/profile', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { name, phone } = req.body;
      const updated = await storage.updateUser(req.user._id, { name, phone });
      
      if (!updated) return res.sendStatus(404);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // UPDATE Password
  app.patch('/api/user/password', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { currentPassword, newPassword } = req.body;
      
      // Verify current password
      const user = await storage.getUserById(req.user._id);
      if (!user) return res.sendStatus(404);

      const { comparePasswords, hashPassword } = await import("./auth.js");
      const isValid = await comparePasswords(currentPassword, user.password);
      
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash and update new password
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(req.user._id, { password: hashedPassword });
      
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("Password update error:", err);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  return httpServer;
}
