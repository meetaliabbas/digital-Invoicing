import React, { useMemo } from "react";
import RedesignLayout from "./RedesignLayout";
import { complianceByTenant, taxBreakdown, invoices } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const Reports = () => {
  const { activeTenant } = useTenant();

  const tenantInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.tenant === activeTenant.name),
    [activeTenant],
  );
  const tenantCompliance = complianceByTenant.find((row) => row.tenant === activeTenant.name);

  const grossSales = tenantInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const salesTax = grossSales * 0.18;
  const withholdingTax = grossSales * 0.03;

  const reportSummary = [
    { id: "sales", label: "Gross Sales", value: `PKR ${(grossSales / 1000).toFixed(1)}K` },
    { id: "salesTax", label: "Sales Tax Charged", value: `PKR ${(salesTax / 1000).toFixed(1)}K` },
    { id: "wht", label: "Withholding Tax", value: `PKR ${(withholdingTax / 1000).toFixed(1)}K` },
    { id: "fiscalized", label: "Fiscalization Rate", value: tenantCompliance ? `${tenantCompliance.complianceRate}%` : "—" },
  ];

  const sortedCompliance = useMemo(() => {
    return [...complianceByTenant].sort((a, b) => {
      if (a.tenant === activeTenant.name) return -1;
      if (b.tenant === activeTenant.name) return 1;
      return 0;
    });
  }, [activeTenant]);

  return (
    <RedesignLayout
      title="Reports & Analytics"
      subtitle={`Tax collection for ${activeTenant.name}, and FBR compliance health across all tenants.`}
      actions={
        <button type="button" className="btn btn-outline-primary d-flex align-items-center gap-1">
          <i className="ri-download-2-line"></i> Export
        </button>
      }
    >
      <div className="row g-3 mb-3">
        {reportSummary.map((item) => (
          <div className="col-xl-3 col-md-6" key={item.id}>
            <div className="rdx-kpi-card">
              <div className="text-muted fs-13 mb-2">{item.label}</div>
              <h4 className="mb-0 fw-bold">{item.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-xl-7">
          <div className="rdx-card p-4 h-100">
            <h5 className="fw-semibold mb-1">Compliance by Tenant</h5>
            <span className="text-muted fs-13">Posted vs. rejected invoices and fiscalization rate</span>

            <div className="table-responsive mt-3">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-muted fs-12 text-uppercase">
                    <th>Tenant</th>
                    <th>Posted</th>
                    <th>Rejected</th>
                    <th style={{ minWidth: 160 }}>Compliance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCompliance.map((row) => (
                    <tr key={row.tenant} className={row.tenant === activeTenant.name ? "table-primary" : ""}>
                      <td className="fw-medium">{row.tenant}</td>
                      <td>{row.posted.toLocaleString()}</td>
                      <td className="text-danger">{row.rejected}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rdx-bar-track flex-grow-1">
                            <div
                              className={`rdx-bar-fill bg-${row.complianceRate >= 97 ? "success" : "warning"}`}
                              style={{ width: `${row.complianceRate}%` }}
                            ></div>
                          </div>
                          <span className="fs-13 fw-medium">{row.complianceRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="rdx-card p-4 h-100">
            <h5 className="fw-semibold mb-1">Tax Breakdown</h5>
            <span className="text-muted fs-13">Share of total tax collected, platform-wide</span>

            <div className="d-flex flex-column gap-3 mt-4">
              {taxBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="d-flex justify-content-between fs-13 mb-1">
                    <span className="fw-medium">{item.label}</span>
                    <span className="text-muted">{item.value}%</span>
                  </div>
                  <div className="rdx-bar-track">
                    <div className={`rdx-bar-fill bg-${item.color}`} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RedesignLayout>
  );
};

export default Reports;
