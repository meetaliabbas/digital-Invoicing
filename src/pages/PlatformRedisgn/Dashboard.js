import React from "react";
import { Link } from "react-router-dom";
import RedesignLayout from "./RedesignLayout";
import { monthlyFiscalization, tenantMixByPlan, invoices } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const statusColor = { Posted: "success", Pending: "warning", Rejected: "danger" };

const formatValue = (stat) => {
  if (stat.id === "tax") {
    return `PKR ${(stat.value / 1000).toFixed(1)}K`;
  }
  return stat.value.toLocaleString();
};

const Dashboard = () => {
  const { activeTenant } = useTenant();
  const maxPosted = Math.max(...monthlyFiscalization.map((m) => m.posted));
  const totalTenantMix = tenantMixByPlan.reduce((sum, item) => sum + item.count, 0);

  const tenantInvoices = invoices.filter((invoice) => invoice.tenant === activeTenant.name);
  const recentInvoices = tenantInvoices.slice(0, 5);
  const fiscalized = tenantInvoices.filter((inv) => inv.status === "Posted").length;
  const rejected = tenantInvoices.filter((inv) => inv.status === "Rejected").length;
  const taxCollected = tenantInvoices.reduce((sum, inv) => sum + inv.amount * 0.18, 0);

  const kpiStats = [
    { id: "invoices", label: "Invoices Fiscalized", value: fiscalized, delta: 8.2, trend: "up", icon: "ri-file-list-3-line", accent: "primary" },
    { id: "branches", label: "Branches", value: activeTenant.branches, delta: 0, trend: "up", icon: "ri-building-4-line", accent: "success" },
    { id: "rejected", label: "FBR Rejections", value: rejected, delta: -12.4, trend: "down", icon: "ri-error-warning-line", accent: "danger" },
    { id: "tax", label: "Tax Collected (PKR)", value: taxCollected, delta: 5.1, trend: "up", icon: "ri-money-dollar-circle-line", accent: "warning" },
  ];

  return (
    <RedesignLayout
      title="Platform Overview"
      subtitle={`Fiscalization activity for ${activeTenant.name}.`}
      actions={
        <Link to="/platform/invoices/create" className="btn btn-primary d-flex align-items-center gap-1">
          <i className="ri-add-line"></i> New Invoice
        </Link>
      }
    >
      <div className="row g-3 mb-3">
        {kpiStats.map((stat) => (
          <div className="col-xl-3 col-md-6" key={stat.id}>
            <div className="rdx-kpi-card d-flex flex-column gap-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className={`rdx-kpi-icon bg-${stat.accent}-subtle text-${stat.accent}`}>
                  <i className={stat.icon}></i>
                </div>
                {stat.id !== "branches" && (
                  <span className={`rdx-chip bg-${stat.trend === "up" ? "success" : "danger"}-subtle text-${stat.trend === "up" ? "success" : "danger"}`}>
                    <i className={`ri-arrow-${stat.trend === "up" ? "up" : "down"}-line`}></i>
                    {Math.abs(stat.delta)}%
                  </span>
                )}
              </div>
              <div>
                <h3 className="mb-0 fw-bold">{formatValue(stat)}</h3>
                <span className="text-muted fs-13">{stat.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-xl-8">
          <div className="rdx-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h5 className="mb-1 fw-semibold">Fiscalization Trend</h5>
                <span className="text-muted fs-13">Posted vs. rejected invoices per month, across all tenants</span>
              </div>
              <div className="d-flex gap-3 fs-13">
                <span className="d-flex align-items-center gap-1">
                  <span className="rounded-circle bg-primary" style={{ width: 8, height: 8, display: "inline-block" }}></span>
                  Posted
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="rounded-circle bg-danger" style={{ width: 8, height: 8, display: "inline-block" }}></span>
                  Rejected
                </span>
              </div>
            </div>

            <div className="d-flex align-items-end gap-3" style={{ height: 200 }}>
              {monthlyFiscalization.map((month) => (
                <div key={month.month} className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end">
                  <div className="d-flex align-items-end gap-1" style={{ height: "100%" }}>
                    <div
                      className="bg-primary rounded-top"
                      style={{ width: 14, height: `${(month.posted / maxPosted) * 100}%` }}
                      title={`Posted: ${month.posted}`}
                    ></div>
                    <div
                      className="bg-danger rounded-top"
                      style={{ width: 14, height: `${(month.rejected / maxPosted) * 100}%` }}
                      title={`Rejected: ${month.rejected}`}
                    ></div>
                  </div>
                  <span className="text-muted fs-12 mt-2">{month.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="rdx-card p-4 h-100">
            <h5 className="mb-1 fw-semibold">Tenants by Plan</h5>
            <span className="text-muted fs-13">Distribution across subscription tiers, platform-wide</span>

            <div className="d-flex flex-column gap-3 mt-4">
              {tenantMixByPlan.map((item) => (
                <div key={item.plan}>
                  <div className="d-flex justify-content-between fs-13 mb-1">
                    <span className="fw-medium">{item.plan}</span>
                    <span className="text-muted">{item.count} tenants</span>
                  </div>
                  <div className="rdx-bar-track">
                    <div
                      className={`rdx-bar-fill bg-${item.color}`}
                      style={{ width: `${(item.count / totalTenantMix) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rdx-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-semibold">Recent Invoices &middot; {activeTenant.name}</h5>
          <Link to="/platform/invoices" className="fs-13 text-decoration-none">
            View all <i className="ri-arrow-right-line align-middle"></i>
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr className="text-muted fs-12 text-uppercase">
                <th>Invoice #</th>
                <th>Buyer</th>
                <th>Type</th>
                <th>Amount (PKR)</th>
                <th>Status</th>
                <th>FBR Reference</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="fw-medium">{invoice.id}</td>
                  <td>{invoice.buyer}</td>
                  <td>{invoice.type}</td>
                  <td>{invoice.amount.toLocaleString()}</td>
                  <td>
                    <span className={`rdx-chip bg-${statusColor[invoice.status]}-subtle text-${statusColor[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="text-muted">{invoice.fbrRef}</td>
                </tr>
              ))}
              {recentInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No invoices yet for {activeTenant.name}.
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

export default Dashboard;
