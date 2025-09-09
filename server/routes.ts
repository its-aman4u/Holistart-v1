import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all MRF requests
  app.get("/api/mrf", async (req, res) => {
    try {
      const mrfs = await storage.getMRFRequests();
      res.json(mrfs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch MRF requests" });
    }
  });

  // Get specific MRF request
  app.get("/api/mrf/:id", async (req, res) => {
    try {
      const mrf = await storage.getMRFRequest(req.params.id);
      if (!mrf) {
        return res.status(404).json({ error: "MRF request not found" });
      }
      res.json(mrf);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch MRF request" });
    }
  });

  // Update MRF request (approve/reject/escalate)
  app.patch("/api/mrf/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        status: z.enum(["approved", "rejected", "escalated"]),
        rejectionReason: z.string().optional(),
      });

      const updates = updateSchema.parse(req.body);
      const updatedMRF = await storage.updateMRFRequest(req.params.id, updates);
      
      if (!updatedMRF) {
        return res.status(404).json({ error: "MRF request not found" });
      }
      
      res.json(updatedMRF);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update MRF request" });
    }
  });

  // Get all onboarding requests
  app.get("/api/onboarding", async (req, res) => {
    try {
      const onboardingRequests = await storage.getOnboardingRequests();
      res.json(onboardingRequests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch onboarding requests" });
    }
  });

  // Get specific onboarding request
  app.get("/api/onboarding/:id", async (req, res) => {
    try {
      const onboarding = await storage.getOnboardingRequest(req.params.id);
      if (!onboarding) {
        return res.status(404).json({ error: "Onboarding request not found" });
      }
      res.json(onboarding);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch onboarding request" });
    }
  });

  // Update onboarding request (approve/reject)
  app.patch("/api/onboarding/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        status: z.enum(["approved", "rejected"]),
        rejectionReason: z.string().optional(),
      });

      const updates = updateSchema.parse(req.body);
      const updatedOnboarding = await storage.updateOnboardingRequest(req.params.id, updates);
      
      if (!updatedOnboarding) {
        return res.status(404).json({ error: "Onboarding request not found" });
      }
      
      res.json(updatedOnboarding);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update onboarding request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
