import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const lineSchema = z.object({
  description: z.string().trim().min(1).max(300),
  quantity: z.number().positive().finite().max(1_000_000),
  unitPrice: z.number().nonnegative().finite().max(1_000_000_000),
  taxRate: z.number().min(0).max(100).default(0),
}).strict();

const createInvoiceSchema = z.object({
  tenantId: z.string().uuid(),
  invoiceNumber: z.string().trim().min(1).max(80),
  invoiceDate: z.string().refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Use a real calendar date in YYYY-MM-DD format"),
  buyerName: z.string().trim().min(1).max(250),
  buyerTaxId: z.string().trim().max(80).nullable().optional(),
  items: z.array(lineSchema).min(1).max(200),
  currency: z.string().regex(/^[A-Za-z]{3}$/).default("PKR"),
}).strict();

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculate(items: z.infer<typeof lineSchema>[]) {
  const normalized = items.map((item) => {
    const lineSubtotal = round2(item.quantity * item.unitPrice);
    const taxAmount = round2(lineSubtotal * item.taxRate / 100);
    const lineTotal = round2(lineSubtotal + taxAmount);
    if (![lineSubtotal, taxAmount, lineTotal].every(Number.isFinite)) {
      throw new Error("Invoice amounts exceed supported limits");
    }
    return { ...item, lineSubtotal, taxAmount, lineTotal };
  });
  const subtotal = round2(normalized.reduce((sum, item) => sum + item.lineSubtotal, 0));
  const taxTotal = round2(normalized.reduce((sum, item) => sum + item.taxAmount, 0));
  const total = round2(subtotal + taxTotal);
  if (![subtotal, taxTotal, total].every(Number.isFinite) || total > 9_999_999_999_999_999) {
    throw new Error("Invoice amounts exceed supported limits");
  }
  return { items: normalized, subtotal, taxTotal, total };
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return supabase;
}

export async function GET(request: NextRequest) {
  const supabase = await authenticatedClient();
  if (!supabase) return json({ error: "Authentication required" }, 401);

  const tenantId = request.nextUrl.searchParams.get("tenantId") ?? "";
  if (!z.string().uuid().safeParse(tenantId).success) {
    return json({ error: "A valid tenantId query parameter is required" }, 400);
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("id, tenant_id, invoice_number, invoice_date, buyer_name, buyer_tax_id, currency, items, subtotal, tax_total, total, status, fbr_reference, created_at, updated_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Invoice list failed", { code: error.code });
    return json({ error: "Could not load invoices" }, 500);
  }
  return json({ invoices: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await authenticatedClient();
  if (!supabase) return json({ error: "Authentication required" }, 401);

  let body: unknown;
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 1_000_000) return json({ error: "Request body is too large" }, 413);
    body = await request.json();
  } catch {
    return json({ error: "A valid JSON request body is required" }, 400);
  }

  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Invalid invoice data", issues: parsed.error.issues.map((issue) => ({
      path: issue.path, code: issue.code, message: issue.message,
    })) }, 400);
  }

  let totals;
  try {
    totals = calculate(parsed.data.items);
  } catch {
    return json({ error: "Invoice amounts exceed supported limits" }, 400);
  }

  const input = parsed.data;
  const { data, error } = await supabase.from("invoices").insert({
    tenant_id: input.tenantId,
    invoice_number: input.invoiceNumber,
    invoice_date: input.invoiceDate,
    buyer_name: input.buyerName,
    buyer_tax_id: input.buyerTaxId || null,
    currency: input.currency.toUpperCase(),
    items: totals.items,
    subtotal: totals.subtotal,
    tax_total: totals.taxTotal,
    total: totals.total,
    status: "draft",
  }).select("id, tenant_id, invoice_number, invoice_date, buyer_name, currency, items, subtotal, tax_total, total, status, created_at").single();

  if (error) {
    if (error.code === "23505") return json({ error: "Invoice number already exists for this tenant" }, 409);
    if (error.code === "42501" || error.code === "PGRST301") return json({ error: "Access denied for this tenant" }, 403);
    console.error("Invoice create failed", { code: error.code });
    return json({ error: "Could not create invoice" }, 500);
  }

  // Database trigger writes the append-only audit event; the client cannot forge events.
  return json({ invoice: data }, 201);
}
