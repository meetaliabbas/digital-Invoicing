import React, { createContext, useContext, useMemo, useState } from "react";
import { tenants, currentTenant } from "./data";

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [activeTenantId, setActiveTenantId] = useState(currentTenant.id);

  const value = useMemo(() => {
    const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];
    return { activeTenant, activeTenantId, setActiveTenantId };
  }, [activeTenantId]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => useContext(TenantContext);
