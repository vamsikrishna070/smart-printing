import { z } from "zod";

// Zod Schemas for validation (shared between frontend and backend)
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  role: z.enum(["student", "staff"]).optional(),
});

export const insertPrintJobSchema = z.object({
  fileName: z.string(),
  filePath: z.string(),
  copies: z.number(),
  printType: z.enum(["bw", "color"]),
});
