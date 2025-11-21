import express from "express";
import { z } from "zod";
import { db } from "../utils/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { randomBytes, createHash } from "crypto";
import { bearerAuth } from "../middleware/bearerAuth";
import type { RequestWithContext } from "../types";
import cors from "cors";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Generate New API Key
app.post("/keys", bearerAuth, async (req: RequestWithContext, res) => {
  const customerId = req.authContext?.customerId;
  if (!customerId) return res.status(401).send();

  try {
    // 1. Generate Raw Key
    const rawKey = "rv_" + randomBytes(24).toString("hex"); // 50 chars
    const salt = randomBytes(16).toString("hex");
    const hash = createHash("sha256").update(rawKey + salt).digest("hex");
    const lookupHash = createHash("sha256").update(rawKey).digest("hex");

    // 2. Store Metadata ONLY
    const keyDoc = {
      customerId,
      hash,
      salt,
      createdAt: new Date().toISOString(),
      revoked: false,
      label: req.body.label || "Console Generated Key"
    };

    // Use lookupHash as ID so we can find it later during verification
    await db.collection("api_keys").doc(lookupHash).set(keyDoc);

    // 3. Link to Customer
    await db.collection("customers").doc(customerId).update({
      apiKeyIds: FieldValue.arrayUnion(lookupHash)
    });

    // 4. RETURN RAW KEY ONCE
    res.json({
      id: lookupHash,
      apiKey: rawKey, // Client must save this NOW
      createdAt: keyDoc.createdAt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate key" });
  }
});

export const consoleApp = app;
