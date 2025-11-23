import { NextRequest, NextResponse } from "next/server";

// This would be implemented as a Firebase Cloud Function in production
// For now, this is a Next.js API route placeholder

export async function POST(_request: NextRequest) {
  // Deprecated: this endpoint was a temporary proxy for payment verification.
  // Production now uses a Firebase Cloud Function `verifyPaymentAndActivate`.
  // Return 410 Gone to indicate deprecation.
  return NextResponse.json(
    { success: false, error: "This endpoint is deprecated. Use the Cloud Function verifyPaymentAndActivate." },
    { status: 410 }
  );
}
