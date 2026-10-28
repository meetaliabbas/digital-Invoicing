import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "reactstrap";
import RedesignLayout from "./RedesignLayout";
import { invoices, invoiceStatusOptions } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const statusColor = { Posted: "success", Pending: "warning", Rejected: "danger" };

const InvoiceList = () => {
  const { activeTenant } = useTenant();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const tenantInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.tenant === activeTenant.name),
    [activeTenant],
  );

  const filtered = useMemo(() => {
    return tenantInvoices.filter((invoice) => {
      const matchesStatus = status === "All" || invoice.status === status;
      const matchesSearch =
        !search ||
        invoice.id.toLowerCase().includes(search.toLowerCase()) ||
        invoice.buyer.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tenantInvoices, search, status]);

  const totalAmount = filtered.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <RedesignLayout
      title="Invoices"
      subtitle={`Sale invoices, debit and credit notes for ${activeTenant.name}.`}
      actions={
        <Link to="/platform/invoices/create" className="btn btn-primary d-flex align-items-center gap-1">
          <i className="ri-add-line"></i> New Invoice
        </Link>
      }
    >
      <div className="rdx-card p-3 mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="ri-search-line text-muted"></i>
              </span>
              <Input
                className="border-start-0"
                placeholder="Search by invoice # or buyer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 d-flex gap-2 flex-wrap">
            {invoiceStatusOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`btn btn-sm ${status === option ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setStatus(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="col-md-3 text-md-end text-muted fs-13">
            {filtered.length} invoices &middot; PKR {totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="rdx-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className="text-muted fs-12 text-uppercase">
                <th className="ps-3">Invoice #</th>
                <th>Buyer</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount (PKR)</th>
                <th>Status</th>
                <th className="pe-3">FBR Reference</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="ps-3 fw-medium">{invoice.id}</td>
                  <td>{invoice.buyer}</td>
                  <td>{invoice.type}</td>
                  <td className="text-muted">{invoice.date}</td>
                  <td>{invoice.amount.toLocaleString()}</td>
                  <td>
                    <span className={`rdx-chip bg-${statusColor[invoice.status]}-subtle text-${statusColor[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="pe-3 text-muted">{invoice.fbrRef}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No invoices match your filters for {activeTenant.name}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RedesignLayout>
  );
};

export default InvoiceList;
