import { db } from "../utils/firestore";

interface CustomerDoc {
  status: "active" | "suspended";
  name: string;
  billingPlan: string;
}

const collection = db.collection("customers");

export class CustomerService {
  static async ensureActive(customerId: string): Promise<CustomerDoc> {
    const doc = await collection.doc(customerId).get();
    if (!doc.exists) {
      throw new Error("CUSTOMER_NOT_FOUND");
    }
    const data = doc.data() as CustomerDoc;
    if (data.status !== "active") {
      throw new Error("CUSTOMER_INACTIVE");
    }
    return data;
  }
}
