import express from "express";
import type { Express } from "express";

const app: Express = express();

app.use(express.json());

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

export default app;
