// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  contactMessages;
  githubProjects;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contactMessages = /* @__PURE__ */ new Map();
    this.githubProjects = /* @__PURE__ */ new Map();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createContactMessage(insertMessage) {
    const id = randomUUID();
    const message = {
      ...insertMessage,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }
  async getContactMessages() {
    return Array.from(this.contactMessages.values());
  }
  async getGitHubProjects() {
    return Array.from(this.githubProjects.values()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  async createGitHubProject(insertProject) {
    const id = randomUUID();
    const project = {
      id,
      githubId: insertProject.githubId,
      name: insertProject.name,
      description: insertProject.description || null,
      htmlUrl: insertProject.htmlUrl,
      language: insertProject.language || null,
      topics: insertProject.topics || null,
      stargazersCount: insertProject.stargazersCount || null,
      forksCount: insertProject.forksCount || null,
      updatedAt: insertProject.updatedAt,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.githubProjects.set(id, project);
    return project;
  }
  async updateGitHubProject(githubId, updates) {
    const existing = Array.from(this.githubProjects.values()).find((p) => p.githubId === githubId);
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        description: updates.description !== void 0 ? updates.description || null : existing.description,
        language: updates.language !== void 0 ? updates.language || null : existing.language,
        topics: updates.topics !== void 0 ? updates.topics || null : existing.topics,
        stargazersCount: updates.stargazersCount !== void 0 ? updates.stargazersCount || null : existing.stargazersCount,
        forksCount: updates.forksCount !== void 0 ? updates.forksCount || null : existing.forksCount
      };
      this.githubProjects.set(existing.id, updated);
      return updated;
    }
    return void 0;
  }
  async getGitHubProjectByGithubId(githubId) {
    return Array.from(this.githubProjects.values()).find((p) => p.githubId === githubId);
  }
};
var storage = new MemStorage();

// server/githubClient.ts
import { Octokit } from "@octokit/rest";
var connectionSettings;
async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? "depl " + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }
  connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=github",
    {
      headers: {
        "Accept": "application/json",
        "X_REPLIT_TOKEN": xReplitToken
      }
    }
  ).then((res) => res.json()).then((data) => data.items?.[0]);
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings || !accessToken) {
    throw new Error("GitHub not connected");
  }
  return accessToken;
}
async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}
async function getGitHubProjects() {
  try {
    const octokit = await getUncachableGitHubClient();
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 20,
      affiliation: "owner"
    });
    return repos.map((repo) => ({
      githubId: repo.id.toString(),
      name: repo.name,
      description: repo.description || null,
      htmlUrl: repo.html_url,
      language: repo.language || null,
      topics: repo.topics || null,
      stargazersCount: repo.stargazers_count.toString(),
      forksCount: repo.forks_count.toString(),
      updatedAt: new Date(repo.updated_at || repo.created_at || Date.now())
    }));
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    throw new Error("Failed to fetch GitHub projects");
  }
}
async function syncGitHubProjects() {
  try {
    const githubProjects2 = await getGitHubProjects();
    const syncedProjects = [];
    for (const project of githubProjects2) {
      const existing = await storage.getGitHubProjectByGithubId(project.githubId);
      if (existing) {
        const updated = await storage.updateGitHubProject(project.githubId, {
          name: project.name,
          description: project.description,
          htmlUrl: project.htmlUrl,
          language: project.language,
          topics: project.topics,
          stargazersCount: project.stargazersCount,
          forksCount: project.forksCount,
          updatedAt: project.updatedAt
        });
        if (updated) {
          syncedProjects.push(updated);
        }
      } else {
        const insertProject = {
          githubId: project.githubId,
          name: project.name,
          description: project.description,
          htmlUrl: project.htmlUrl,
          language: project.language,
          topics: project.topics,
          stargazersCount: project.stargazersCount,
          forksCount: project.forksCount,
          updatedAt: project.updatedAt
        };
        const created = await storage.createGitHubProject(insertProject);
        syncedProjects.push(created);
      }
    }
    console.log(`Synced ${syncedProjects.length} GitHub projects`);
    return syncedProjects;
  } catch (error) {
    console.error("Error syncing GitHub projects:", error);
    throw new Error("Failed to sync GitHub projects");
  }
}

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var githubProjects = pgTable("github_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  githubId: text("github_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  htmlUrl: text("html_url").notNull(),
  language: text("language"),
  topics: jsonb("topics").$type().default([]),
  stargazersCount: text("stargazers_count").default("0"),
  forksCount: text("forks_count").default("0"),
  updatedAt: timestamp("updated_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true
});
var insertGitHubProjectSchema = createInsertSchema(githubProjects).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
import nodemailer from "nodemailer";
async function registerRoutes(app2) {
  app2.get("/api/github/projects", async (req, res) => {
    try {
      await syncGitHubProjects();
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
  app2.get("/api/github/projects/sync", async (req, res) => {
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
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
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
  app2.get("/api/resume/download", (req, res) => {
    res.status(200).json({
      message: "Resume download endpoint",
      downloadUrl: "/Ranjan_Resume.pdf"
      // Placeholder URL
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}
async function sendContactEmail(contactData) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "info.krranjan@gmail.com",
        pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER || "info.krranjan@gmail.com",
      to: "info.krranjan@gmail.com",
      subject: `Portfolio Contact: ${contactData.subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message.replace(/\n/g, "<br>")}</p>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
