import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getGitHubProjects, syncGitHubProjects } from "./githubClient";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";


export async function registerRoutes(app: Express): Promise<Server> {
  // GitHub Projects API
  app.get("/api/github/projects", async (req, res) => {
    try {
      // Sync projects from GitHub first
      await syncGitHubProjects();
      
      // Get projects from storage
      const projects = await storage.getGitHubProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching GitHub projects:", error);
      res.status(500).json({ 
        message: "Failed to fetch GitHub projects",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/github/projects/sync", async (req, res) => {
    try {
      const projects = await syncGitHubProjects();
      res.json({ 
        message: "GitHub projects synced successfully", 
        count: projects.length,
        projects 
      });
    } catch (error) {
      console.error("Error syncing GitHub projects:", error);
      res.status(500).json({ 
        message: "Failed to sync GitHub projects",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Contact Form API
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Save to storage
      const message = await storage.createContactMessage(validatedData);
      
      // Send email notification
      await sendContactEmail(validatedData);
      
      res.json({ 
        message: "Message sent successfully",
        id: message.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error processing contact form:", error);
        res.status(500).json({ 
          message: "Failed to send message",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  // Resume download API
  app.get("/api/resume/download", (req, res) => {
    // In production, this would serve the actual PDF file
    res.status(200).json({
      message: "Resume download endpoint",
      downloadUrl: "/Ranjan_Resume.pdf" // Placeholder URL
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function sendContactEmail(contactData: any) {
  try {
    // Configure nodemailer with environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'info.krranjan@gmail.com',
        pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'info.krranjan@gmail.com',
      to: 'info.krranjan@gmail.com',
      subject: `Portfolio Contact: ${contactData.subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error to avoid breaking the contact form
  }
}
