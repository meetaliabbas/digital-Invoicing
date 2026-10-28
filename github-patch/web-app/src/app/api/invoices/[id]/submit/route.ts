import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims?.sub) return json({ error: "Authentication required" }, 401);

  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) return json({ error: "Invalid invoice id" }, 400);

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("id, tenant_id, status")
    .eq("id", id)
    .maybeSingle();

  if (error || !invoice) return json({ error: "Invoice not found or access denied" }, 404);
  if (invoice.status === "submitted" || invoice.status === "accepted") {
    return json({ error: "Invoice is already marked submitted; duplicate submission blocked" }, 409);
  }

  // Fail closed until a current official FBR/PRAL contract, credentials, response
  // mapping, retry strategy and sandbox acceptance have been implemented and tested.
  if (process.env.FBR_SUBMISSION_ENABLED !== "true") {
    return json({
      error: "FBR submission is disabled until the official adapter is configured",
      code: "FBR_ADAPTER_NOT_CONFIGURED",
      invoiceId: invoice.id,
      status: invoice.status,
    }, 503);
  }

  return json({
    error: "FBR submission flag is set, but no approved provider adapter is implemented",
    code: "FBR_ADAPTER_IMPLEMENTATION_REQUIRED",
  }, 501);
}
