// Static, array-based mock data for the redesigned platform pages.
// No API/Redux calls here on purpose - every page below reads from these arrays.

export const currentTenant = {
  id: "TEN-0001",
  name: "Al-Karam Textiles (Pvt) Ltd",
  ntn: "1234567-8",
  plan: "Enterprise",
};

export const tenants = [
  { id: "TEN-0001", name: "Al-Karam Textiles (Pvt) Ltd", ntn: "1234567-8", status: "Active", branches: 6, plan: "Enterprise", city: "Karachi" },
  { id: "TEN-0002", name: "Sadaqat Traders", ntn: "2233445-1", status: "Active", branches: 2, plan: "Business", city: "Lahore" },
  { id: "TEN-0003", name: "Falcon Pharma Distribution", ntn: "3344556-2", status: "Active", branches: 4, plan: "Enterprise", city: "Islamabad" },
  { id: "TEN-0004", name: "Zamzam Foods & Beverages", ntn: "4455667-3", status: "Suspended", branches: 1, plan: "Starter", city: "Multan" },
  { id: "TEN-0005", name: "NexGen Electronics", ntn: "5566778-4", status: "Active", branches: 3, plan: "Business", city: "Faisalabad" },
];

export const kpiStats = [
  { id: "invoices", label: "Invoices Fiscalized", value: 18420, delta: 8.2, trend: "up", icon: "ri-file-list-3-line", accent: "primary" },
  { id: "tenants", label: "Active Tenants", value: 42, delta: 4.6, trend: "up", icon: "ri-building-4-line", accent: "success" },
  { id: "rejected", label: "FBR Rejections", value: 63, delta: -12.4, trend: "down", icon: "ri-error-warning-line", accent: "danger" },
  { id: "tax", label: "Tax Collected (PKR)", value: 48250000, delta: 5.1, trend: "up", icon: "ri-money-dollar-circle-line", accent: "warning" },
];

export const monthlyFiscalization = [
  { month: "Jan", posted: 1120, rejected: 22 },
  { month: "Feb", posted: 1340, rejected: 18 },
  { month: "Mar", posted: 1510, rejected: 25 },
  { month: "Apr", posted: 1290, rejected: 14 },
  { month: "May", posted: 1680, rejected: 30 },
  { month: "Jun", posted: 1890, rejected: 21 },
  { month: "Jul", posted: 2040, rejected: 19 },
];

export const tenantMixByPlan = [
  { plan: "Enterprise", count: 14, color: "primary" },
  { plan: "Business", count: 19, color: "success" },
  { plan: "Starter", count: 9, color: "warning" },
];

export const invoices = [
  { id: "INV-100245", buyer: "United Mills Corp.", tenant: "Al-Karam Textiles (Pvt) Ltd", type: "Sale Invoice", amount: 452300, date: "2026-08-05", status: "Posted", fbrRef: "FBR-9982314" },
  { id: "INV-100246", buyer: "Metro Retail Chain", tenant: "Sadaqat Traders", type: "Sale Invoice", amount: 128900, date: "2026-08-05", status: "Posted", fbrRef: "FBR-9982315" },
  { id: "INV-100247", buyer: "Crescent Pharmacy", tenant: "Falcon Pharma Distribution", type: "Debit Note", amount: 34200, date: "2026-08-04", status: "Pending", fbrRef: "-" },
  { id: "INV-100248", buyer: "Green Valley Foods", tenant: "Zamzam Foods & Beverages", type: "Sale Invoice", amount: 76500, date: "2026-08-04", status: "Rejected", fbrRef: "-" },
  { id: "INV-100249", buyer: "Skyline Electronics Mart", tenant: "NexGen Electronics", type: "Sale Invoice", amount: 213400, date: "2026-08-03", status: "Posted", fbrRef: "FBR-9982298" },
  { id: "INV-100250", buyer: "United Mills Corp.", tenant: "Al-Karam Textiles (Pvt) Ltd", type: "Credit Note", amount: 18900, date: "2026-08-03", status: "Posted", fbrRef: "FBR-9982290" },
  { id: "INV-100251", buyer: "Metro Retail Chain", tenant: "Sadaqat Traders", type: "Sale Invoice", amount: 99200, date: "2026-08-02", status: "Pending", fbrRef: "-" },
  { id: "INV-100252", buyer: "Crescent Pharmacy", tenant: "Falcon Pharma Distribution", type: "Sale Invoice", amount: 156800, date: "2026-08-02", status: "Posted", fbrRef: "FBR-9982271" },
];

export const invoiceStatusOptions = ["All", "Posted", "Pending", "Rejected"];

export const buyers = [
  { id: "BYR-001", name: "United Mills Corp.", ntn: "0011223-4", city: "Karachi", type: "Registered", totalInvoices: 128, lastInvoice: "2026-08-05", tenant: "Al-Karam Textiles (Pvt) Ltd" },
  { id: "BYR-002", name: "Metro Retail Chain", ntn: "0022334-5", city: "Lahore", type: "Registered", totalInvoices: 76, lastInvoice: "2026-08-05", tenant: "Sadaqat Traders" },
  { id: "BYR-003", name: "Crescent Pharmacy", ntn: "0033445-6", city: "Islamabad", type: "Unregistered", totalInvoices: 41, lastInvoice: "2026-08-04", tenant: "Falcon Pharma Distribution" },
  { id: "BYR-004", name: "Green Valley Foods", ntn: "0044556-7", city: "Faisalabad", type: "Registered", totalInvoices: 19, lastInvoice: "2026-08-04", tenant: "Zamzam Foods & Beverages" },
  { id: "BYR-005", name: "Skyline Electronics Mart", ntn: "0055667-8", city: "Multan", type: "Registered", totalInvoices: 63, lastInvoice: "2026-08-03", tenant: "NexGen Electronics" },
  { id: "BYR-006", name: "Al-Noor Wholesale", ntn: "0066778-9", city: "Peshawar", type: "Unregistered", totalInvoices: 27, lastInvoice: "2026-07-30", tenant: "NexGen Electronics" },
];

export const hsCodeOptions = [
  { code: "5208.1100", description: "Cotton fabric, plain weave, unbleached" },
  { code: "3004.9099", description: "Pharmaceutical products, other" },
  { code: "2202.9990", description: "Non-alcoholic beverages, other" },
  { code: "8517.1200", description: "Telephones for cellular networks" },
];

export const uomOptions = ["PCS", "KG", "MTR", "LTR", "DZN", "SET"];

export const provinceOptions = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory"];

export const emptyInvoiceItem = () => ({
  id: Date.now() + Math.random(),
  hsCode: "",
  description: "",
  qty: 1,
  uom: "PCS",
  rate: 0,
  taxRate: 18,
});

export const reportSummary = [
  { id: "sales", label: "Gross Sales", value: "PKR 128.4M", change: "+6.4%", trend: "up" },
  { id: "salesTax", label: "Sales Tax Charged", value: "PKR 21.6M", change: "+5.1%", trend: "up" },
  { id: "wht", label: "Withholding Tax", value: "PKR 3.8M", change: "-1.2%", trend: "down" },
  { id: "fiscalized", label: "Fiscalization Rate", value: "97.6%", change: "+0.8%", trend: "up" },
];

export const complianceByTenant = [
  { tenant: "Al-Karam Textiles (Pvt) Ltd", posted: 3820, rejected: 44, complianceRate: 98.9 },
  { tenant: "Sadaqat Traders", posted: 1220, rejected: 61, complianceRate: 95.2 },
  { tenant: "Falcon Pharma Distribution", posted: 2410, rejected: 18, complianceRate: 99.3 },
  { tenant: "Zamzam Foods & Beverages", posted: 640, rejected: 52, complianceRate: 92.1 },
  { tenant: "NexGen Electronics", posted: 1980, rejected: 26, complianceRate: 98.7 },
];

export const taxBreakdown = [
  { label: "Sales Tax", value: 62, color: "primary" },
  { label: "Federal Excise Duty", value: 14, color: "warning" },
  { label: "Withholding Tax", value: 17, color: "success" },
  { label: "Further Tax", value: 7, color: "info" },
];

export const sellerProfile = {
  businessName: currentTenant.name,
  ntn: currentTenant.ntn,
  strn: "32-14-9988-112-33",
  businessType: "Manufacturer",
  address: "Plot 14, Sector G-8, Industrial Area",
  city: "Karachi",
  province: "Sindh",
  postalCode: "74900",
  contactEmail: "finance@alkaramtextiles.pk",
  contactPhone: "+92 21 111 222 333",
  bankName: "Habib Bank Limited",
  accountTitle: "Al-Karam Textiles (Pvt) Ltd",
  iban: "PK36HABB0000001234567890",
  fbrEnvironment: "Sandbox",
  fbrApiKey: "sb-9f2c-44ee-9d31-fbr-key",
};

export const businessTypeOptions = ["Manufacturer", "Importer", "Distributor", "Retailer", "Service Provider"];

export const notifications = [
  { id: 1, type: "success", icon: "ri-checkbox-circle-line", title: "Invoice INV-100252 fiscalized", message: "Posted successfully to FBR for Falcon Pharma Distribution.", tenant: "Falcon Pharma Distribution", time: "5 minutes ago", read: false },
  { id: 2, type: "danger", icon: "ri-close-circle-line", title: "Invoice INV-100248 rejected", message: "FBR rejected due to invalid HS code on line item 2.", tenant: "Zamzam Foods & Beverages", time: "2 hours ago", read: false },
  { id: 3, type: "warning", icon: "ri-error-warning-line", title: "NTN mismatch flagged", message: "Buyer NTN could not be verified against the FBR registry.", tenant: "Sadaqat Traders", time: "4 hours ago", read: false },
  { id: 4, type: "success", icon: "ri-checkbox-circle-line", title: "Invoice INV-100251 fiscalized", message: "Posted successfully to FBR for Sadaqat Traders.", tenant: "Sadaqat Traders", time: "6 hours ago", read: true },
  { id: 5, type: "info", icon: "ri-user-add-line", title: "New buyer profile added", message: "Al-Noor Wholesale added to the buyer directory.", tenant: "NexGen Electronics", time: "Yesterday", read: true },
  { id: 6, type: "success", icon: "ri-checkbox-circle-line", title: "Invoice INV-100249 fiscalized", message: "Posted successfully to FBR for NexGen Electronics.", tenant: "NexGen Electronics", time: "Yesterday", read: true },
  { id: 7, type: "warning", icon: "ri-time-line", title: "FBR gateway response delayed", message: "Average response time exceeded 8s during the peak submission window.", tenant: "Platform", time: "2 days ago", read: true },
  { id: 8, type: "danger", icon: "ri-close-circle-line", title: "Invoice INV-100247 pending review", message: "Debit note held for manual tax rate confirmation.", tenant: "Falcon Pharma Distribution", time: "3 days ago", read: true },
];
