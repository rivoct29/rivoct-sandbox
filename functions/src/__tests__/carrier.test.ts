import { describe, it, expect, vi } from "vitest";
import CarrierProvider from "../providers/carrier";

describe("CarrierProvider (placeholder)", () => {
  it("returns error when API key missing", async () => {
    // Construct with a baseUrl that won't be called because getCarrierApiKey will be empty
    const prov = new CarrierProvider("https://example.invalid");
    const res = await prov.activateService("cust-1", "plan-1");
    expect(res.status).toBe("error");
  });

  it("can be created", () => {
    const prov = new CarrierProvider();
    expect(prov).toBeTruthy();
  });
});
