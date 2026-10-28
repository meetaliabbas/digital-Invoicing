import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Compatibility tenant context for the legacy React dashboard.
 *
 * This context only stores the currently selected tenant in UI state. It is NOT
 * an authorization boundary. Every API request must independently authenticate
 * the user and enforce tenant membership in the backend/database (e.g. Supabase
 * RLS). Never trust a tenant ID from this context alone.
 */
export const TenantContext = createContext(null);

export function TenantProvider({ children, initialTenant = null, initialTenants = [] }) {
  const [currentTenant, setCurrentTenantState] = useState(initialTenant);
  const [tenants, setTenants] = useState(Array.isArray(initialTenants) ? initialTenants : []);

  const setCurrentTenant = useCallback((tenant) => {
    setCurrentTenantState(tenant || null);
  }, []);

  const setTenant = setCurrentTenant;
  const tenantId = currentTenant?.id ?? currentTenant?.tenant_id ?? null;
  const setTenantId = useCallback((id) => {
    if (!id) {
      setCurrentTenantState(null);
      return;
    }
    setCurrentTenantState((previous) => {
      if (previous?.id === id || previous?.tenant_id === id) return previous;
      return tenants.find((tenant) => tenant?.id === id || tenant?.tenant_id === id) || { id };
    });
  }, [tenants]);

  const value = useMemo(() => ({
    tenant: currentTenant,
    currentTenant,
    selectedTenant: currentTenant,
    tenantId,
    tenants,
    setTenant,
    setCurrentTenant,
    setSelectedTenant: setCurrentTenant,
    setTenantId,
    setTenants,
  }), [currentTenant, tenantId, tenants, setTenant, setCurrentTenant, setTenantId]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const value = useContext(TenantContext);
  if (value === null) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return value;
}

export const useTenantContext = useTenant;
export default TenantContext;
