import { type Response, type NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import type { RequestWithContext } from "../types";

export const bearerAuth = async (req: RequestWithContext, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized", code: "NO_TOKEN" });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);

    // Populate context for the handler
    req.authContext = {
      customerId: decodedToken.uid, // In this model, uid IS the customerId
      apiKeyId: "console",
      roles: ["admin"]
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ error: "Invalid Token", code: "INVALID_TOKEN" });
  }
};
