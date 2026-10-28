import React, { useMemo, useState } from "react";
import { Input } from "reactstrap";
import RedesignLayout from "./RedesignLayout";
import { tenants } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const planColor = { Enterprise: "primary", Business: "success", Starter: "warning" };

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const Tenants = () => {
  const { activeTenant, setActiveTenantId } = useTenant();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesStatus = status === "All" || tenant.status === status;
      const matchesSearch =
        !search ||
        tenant.name.toLowerCase().includes(search.toLowerCase()) ||
        tenant.ntn.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  const stats = useMemo(() => {
    const active = tenants.filter((t) => t.status === "Active").length;
    const suspended = tenants.filter((t) => t.status === "Suspended").length;
    const enterprise = tenants.filter((t) => t.plan === "Enterprise").length;
    return [
      { id: "total", label: "Total Tenants", value: tenants.length, icon: "ri-building-4-line", accent: "primary" },
      { id: "active", label: "Active", value: active, icon: "ri-checkbox-circle-line", accent: "success" },
      { id: "suspended", label: "Suspended", value: suspended, icon: "ri-pause-circle-line", accent: "danger" },
      { id: "enterprise", label: "Enterprise Plan", value: enterprise, icon: "ri-vip-crown-2-line", accent: "warning" },
    ];
  }, []);

  return (
    <RedesignLayout
      title="Tenants"
      subtitle="Every business workspace running on this platform."
      actions={
        <button type="button" className="btn btn-primary d-flex align-items-center gap-1">
          <i className="ri-add-line"></i> Add Tenant
        </button>
      }
    >
      <div className="row g-3 mb-3">
        {stats.map((stat) => (
          <div className="col-xl-3 col-md-6" key={stat.id}>
            <div className="rdx-kpi-card d-flex align-items-center gap-3">
              <div className={`rdx-kpi-icon bg-${stat.accent}-subtle text-${stat.accent}`}>
                <i className={stat.icon}></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{stat.value}</h4>
                <span className="text-muted fs-13">{stat.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            {["All", "Active", "Suspended"].map((option) => (
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
        </div>
      </div>

      <div className="row g-3">
        {filtered.map((tenant) => {
          const isActive = tenant.id === activeTenant.id;
          return (
            <div className="col-xl-4 col-md-6" key={tenant.id}>
              <div className={`rdx-buyer-card d-flex flex-column gap-3 ${isActive ? "rdx-buyer-card-active" : ""}`}>
                <div className="d-flex align-items-start justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
                      style={{ width: 46, height: 46 }}
                    >
                      {initials(tenant.name)}
                    </span>
                    <div>
                      <div className="fw-semibold">{tenant.name}</div>
                      <div className="text-muted fs-13">NTN {tenant.ntn}</div>
                    </div>
                  </div>
                  <span
                    className={`rdx-chip bg-${tenant.status === "Active" ? "success" : "secondary"}-subtle text-${
                      tenant.status === "Active" ? "success" : "secondary"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </div>

                <div className="d-flex justify-content-between fs-13">
                  <span className="text-muted">Plan</span>
                  <span className={`rdx-chip bg-${planColor[tenant.plan]}-subtle text-${planColor[tenant.plan]}`}>{tenant.plan}</span>
                </div>
                <div className="d-flex justify-content-between fs-13">
                  <span className="text-muted">City</span>
                  <span>{tenant.city}</span>
                </div>
                <div className="d-flex justify-content-between fs-13">
                  <span className="text-muted">Branches</span>
                  <span className="fw-medium">{tenant.branches}</span>
                </div>

                {isActive ? (
                  <span className="rdx-chip bg-primary-subtle text-primary justify-content-center mt-1">
                    <i className="ri-checkbox-circle-fill"></i> Currently Viewing
                  </span>
                ) : (
                  <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={() => setActiveTenantId(tenant.id)}>
                    Switch to Workspace
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-12">
            <div className="rdx-card p-5 text-center text-muted">No tenants match your filters.</div>
          </div>
        )}
      </div>
    </RedesignLayout>
  );
};

export default Tenants;
