import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { TenantProvider } from "../pages/PlatformRedesign/TenantContext";
import PlatformLogin from "../pages/PlatformRedesign/Login";
import PlatformDashboard from "../pages/PlatformRedesign/Dashboard";
import PlatformInvoiceList from "../pages/PlatformRedesign/InvoiceList";
import PlatformCreateInvoice from "../pages/PlatformRedesign/CreateInvoice";
import PlatformBuyerProfiles from "../pages/PlatformRedesign/BuyerProfiles";
import PlatformTenants from "../pages/PlatformRedesign/Tenants";
import PlatformReports from "../pages/PlatformRedesign/Reports";
import PlatformNotifications from "../pages/PlatformRedesign/Notifications";
import PlatformSettings from "../pages/PlatformRedesign/Settings";

const Index = () => {
  return (
    <TenantProvider>
      <Routes>
        <Route path="/platform/login" element={<PlatformLogin />} />
        <Route path="/platform/dashboard" element={<PlatformDashboard />} />
        <Route path="/platform/invoices" element={<PlatformInvoiceList />} />
        <Route path="/platform/invoices/create" element={<PlatformCreateInvoice />} />
        <Route path="/platform/buyers" element={<PlatformBuyerProfiles />} />
        <Route path="/platform/tenants" element={<PlatformTenants />} />
        <Route path="/platform/reports" element={<PlatformReports />} />
        <Route path="/platform/notifications" element={<PlatformNotifications />} />
        <Route path="/platform/settings" element={<PlatformSettings />} />
        <Route path="*" element={<Navigate to="/platform/login" replace />} />
      </Routes>
    </TenantProvider>
  );
};

export default Index;
