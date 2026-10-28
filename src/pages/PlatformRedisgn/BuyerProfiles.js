import React, { useMemo, useState } from "react";
import { Input } from "reactstrap";
import RedesignLayout from "./RedesignLayout";
import { buyers } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const BuyerProfiles = () => {
  const { activeTenant } = useTenant();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const tenantBuyers = useMemo(
    () => buyers.filter((buyer) => buyer.tenant === activeTenant.name),
    [activeTenant],
  );

  const filtered = useMemo(() => {
    return tenantBuyers.filter((buyer) => {
      const matchesType = typeFilter === "All" || buyer.type === typeFilter;
      const matchesSearch =
        !search ||
        buyer.name.toLowerCase().includes(search.toLowerCase()) ||
        buyer.ntn.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [tenantBuyers, search, typeFilter]);

  return (
    <RedesignLayout
      title="Buyer Profiles"
      subtitle={`Buyers linked to invoices for ${activeTenant.name}.`}
      actions={
        <button type="button" className="btn btn-primary d-flex align-items-center gap-1">
          <i className="ri-user-add-line"></i> Add Buyer
        </button>
      }
    >
      <div className="rdx-card p-3 mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="ri-search-line text-muted"></i>
              </span>
              <Input
                className="border-start-0"
                placeholder="Search by name or NTN"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 d-flex gap-2 justify-content-md-end">
            {["All", "Registered", "Unregistered"].map((option) => (
              <button
                key={option}
                type="button"
                className={`btn btn-sm ${typeFilter === option ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setTypeFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3">
        {filtered.map((buyer) => (
          <div className="col-xl-4 col-md-6" key={buyer.id}>
            <div className="rdx-buyer-card d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <span
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
                  style={{ width: 46, height: 46 }}
                >
                  {initials(buyer.name)}
                </span>
                <div>
                  <div className="fw-semibold">{buyer.name}</div>
                  <div className="text-muted fs-13">NTN {buyer.ntn}</div>
                </div>
              </div>

              <div className="d-flex justify-content-between fs-13">
                <span className="text-muted">City</span>
                <span>{buyer.city}</span>
              </div>
              <div className="d-flex justify-content-between fs-13">
                <span className="text-muted">Registration</span>
                <span
                  className={`rdx-chip bg-${buyer.type === "Registered" ? "success" : "warning"}-subtle text-${
                    buyer.type === "Registered" ? "success" : "warning"
                  }`}
                >
                  {buyer.type}
                </span>
              </div>
              <div className="d-flex justify-content-between fs-13">
                <span className="text-muted">Invoices Issued</span>
                <span className="fw-medium">{buyer.totalInvoices}</span>
              </div>
              <div className="d-flex justify-content-between fs-13">
                <span className="text-muted">Last Invoice</span>
                <span>{buyer.lastInvoice}</span>
              </div>

              <button type="button" className="btn btn-outline-primary btn-sm mt-1">
                View History
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-12">
            <div className="rdx-card p-5 text-center text-muted">No buyers match your filters for {activeTenant.name}.</div>
          </div>
        )}
      </div>
    </RedesignLayout>
  );
};

export default BuyerProfiles;
