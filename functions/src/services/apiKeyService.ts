import { db } from "../utils/firestore";
import { deriveLookupHash, hashWithSalt } from "../utils/crypto";
import type { AuthContext } from "../types";

interface ApiKeyDoc {
  customerId: string;
  salt: string;
  hash: string;
  revoked: boolean;
  roles?: string[];
}

const collection = db.collection("api_keys");

export class ApiKeyService {
  static async verify(apiKey: string): Promise<AuthContext> {
    const lookupHash = deriveLookupHash(apiKey);
    const docSnap = await collection.doc(lookupHash).get();
    if (!docSnap.exists) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    const data = docSnap.data() as ApiKeyDoc;
    if (data.revoked) {
      throw new Error("API_KEY_REVOKED");
    }

    const computed = hashWithSalt(apiKey, data.salt);
    if (computed !== data.hash) {
      throw new Error("API_KEY_INVALID");
    }

    return {
      customerId: data.customerId,
      apiKeyId: lookupHash,
      roles: data.roles ?? []
    };
  }
}
