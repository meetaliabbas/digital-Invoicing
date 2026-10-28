import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "fbr-invoicing-web", mode: "starter", fbrSubmissionEnabled: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
