import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import fbrBadge from "../../assets/images/fbr-logo-new.png";
import BrandMark from "./BrandMark";
import { tenants } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const navItems = [
  { to: "/platform/dashboard", label: "Overview", icon: "ri-dashboard-2-line" },
  { to: "/platform/invoices", label: "Invoices", icon: "ri-file-list-3-line" },
  { to: "/platform/invoices/create", label: "New Invoice", icon: "ri-add-circle-line" },
  { to: "/platform/buyers", label: "Buyers", icon: "ri-team-line" },
  { to: "/platform/tenants", label: "Tenants", icon: "ri-building-4-line" },
  { to: "/platform/reports", label: "Reports", icon: "ri-bar-chart-2-line" },
  { to: "/platform/notifications", label: "Alerts", icon: "ri-notification-3-line" },
  { to: "/platform/settings", label: "Settings", icon: "ri-settings-4-line" },
];

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const RedesignLayout = ({ title, subtitle, actions, children }) => {
  const navigate = useNavigate();
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { activeTenant, setActiveTenantId } = useTenant();

  return (
    <div className="rdx-shell">
      <aside className="rdx-rail">
        <div className="rdx-rail-brand">
          <BrandMark size={42} />
        </div>
        <nav className="rdx-rail-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/platform/invoices"}
              className={({ isActive }) => `rdx-rail-link${isActive ? " active" : ""}`}
            >
              <i className={item.icon}></i>
              <span>{item.label.split(" ")[0]}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="rdx-main">
        <header className="rdx-topbar">
          <Dropdown isOpen={tenantMenuOpen} toggle={() => setTenantMenuOpen((v) => !v)}>
            <DropdownToggle tag="div" className="rdx-tenant-switch">
              <span className="rdx-tenant-avatar">{initials(activeTenant.name)}</span>
              <div className="d-flex flex-column lh-1">
                <span className="fw-semibold fs-13">{activeTenant.name}</span>
                <span className="text-muted" style={{ fontSize: 11 }}>
                  Tenant workspace
                </span>
              </div>
              <i className="ri-arrow-down-s-line text-muted"></i>
            </DropdownToggle>
            <DropdownMenu className="p-2" style={{ minWidth: 260 }}>
              <div className="px-2 pb-2 text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: ".04em" }}>
                Switch tenant
              </div>
              {tenants.map((tenant) => (
                <DropdownItem
                  key={tenant.id}
                  active={tenant.id === activeTenant.id}
                  className="d-flex align-items-center justify-content-between rounded"
                  onClick={() => setActiveTenantId(tenant.id)}
                >
                  <span>{tenant.name}</span>
                  <span
                    className={`badge rounded-pill bg-${
                      tenant.status === "Active" ? "success" : "secondary"
                    }-subtle text-${tenant.status === "Active" ? "success" : "secondary"}`}
                  >
                    {tenant.status}
                  </span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <div className="d-flex align-items-center gap-3">
            <img src={fbrBadge} alt="FBR" className="rdx-fbr-badge" />
            <Dropdown isOpen={userMenuOpen} toggle={() => setUserMenuOpen((v) => !v)}>
              <DropdownToggle tag="button" className="btn btn-light btn-icon rounded-circle">
                <i className="ri-user-3-line"></i>
              </DropdownToggle>
              <DropdownMenu end className="p-2" style={{ minWidth: 180 }}>
                <DropdownItem className="rounded">
                  <i className="ri-account-circle-line me-2"></i>My Profile
                </DropdownItem>
                <DropdownItem className="rounded" onClick={() => navigate("/platform/settings")}>
                  <i className="ri-settings-3-line me-2"></i>Settings
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem className="rounded text-danger" onClick={() => navigate("/platform/login")}>
                  <i className="ri-logout-box-r-line me-2"></i>Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        <main className="rdx-content">
          <div className="rdx-page-head">
            <div>
              <h4 className="mb-1 fw-semibold">{title}</h4>
              {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
            </div>
            {actions ? <div className="d-flex gap-2 flex-wrap">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default RedesignLayout;
