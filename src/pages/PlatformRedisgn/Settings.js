import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import RedesignLayout from "./RedesignLayout";
import { sellerProfile, businessTypeOptions, provinceOptions } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);

const buildProfile = (tenant) => ({
  ...sellerProfile,
  businessName: tenant.name,
  ntn: tenant.ntn,
  city: tenant.city,
  accountTitle: tenant.name,
  contactEmail: `finance@${slugify(tenant.name)}.pk`,
});

const Settings = () => {
  const { activeTenant } = useTenant();
  const [form, setForm] = useState(() => buildProfile(activeTenant));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(buildProfile(activeTenant));
    setSaved(false);
  }, [activeTenant]);

  const update = (field) => (e) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleEnvironment = () => {
    setSaved(false);
    setForm((prev) => ({ ...prev, fbrEnvironment: prev.fbrEnvironment === "Sandbox" ? "Production" : "Sandbox" }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <RedesignLayout title="Business Settings" subtitle={`Profile, banking and FBR integration for ${activeTenant.name}.`}>
      <form onSubmit={handleSave}>
        {saved && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
            <i className="ri-checkbox-circle-line fs-18"></i> Settings saved successfully.
          </div>
        )}

        <div className="rdx-card p-4 mb-3">
          <h5 className="fw-semibold mb-1">Business Profile</h5>
          <span className="text-muted fs-13">Registered details used on every fiscalized invoice.</span>

          <div className="row g-3 mt-1">
            <div className="col-md-6">
              <Label className="form-label">Business Name</Label>
              <Input value={form.businessName} onChange={update("businessName")} />
            </div>
            <div className="col-md-3">
              <Label className="form-label">NTN</Label>
              <Input value={form.ntn} onChange={update("ntn")} />
            </div>
            <div className="col-md-3">
              <Label className="form-label">STRN</Label>
              <Input value={form.strn} onChange={update("strn")} />
            </div>
            <div className="col-md-4">
              <Label className="form-label">Business Type</Label>
              <Input type="select" value={form.businessType} onChange={update("businessType")}>
                {businessTypeOptions.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Input>
            </div>
            <div className="col-md-4">
              <Label className="form-label">Province</Label>
              <Input type="select" value={form.province} onChange={update("province")}>
                {provinceOptions.map((province) => (
                  <option key={province}>{province}</option>
                ))}
              </Input>
            </div>
            <div className="col-md-4">
              <Label className="form-label">City</Label>
              <Input value={form.city} onChange={update("city")} />
            </div>
            <div className="col-md-8">
              <Label className="form-label">Address</Label>
              <Input value={form.address} onChange={update("address")} />
            </div>
            <div className="col-md-4">
              <Label className="form-label">Postal Code</Label>
              <Input value={form.postalCode} onChange={update("postalCode")} />
            </div>
            <div className="col-md-6">
              <Label className="form-label">Contact Email</Label>
              <Input type="email" value={form.contactEmail} onChange={update("contactEmail")} />
            </div>
            <div className="col-md-6">
              <Label className="form-label">Contact Phone</Label>
              <Input value={form.contactPhone} onChange={update("contactPhone")} />
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-xl-6">
            <div className="rdx-card p-4 h-100">
              <h5 className="fw-semibold mb-1">Bank Details</h5>
              <span className="text-muted fs-13">Used for tax payment references.</span>

              <div className="row g-3 mt-1">
                <div className="col-12">
                  <Label className="form-label">Bank Name</Label>
                  <Input value={form.bankName} onChange={update("bankName")} />
                </div>
                <div className="col-12">
                  <Label className="form-label">Account Title</Label>
                  <Input value={form.accountTitle} onChange={update("accountTitle")} />
                </div>
                <div className="col-12">
                  <Label className="form-label">IBAN</Label>
                  <Input value={form.iban} onChange={update("iban")} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="rdx-card p-4 h-100">
              <h5 className="fw-semibold mb-1">FBR Integration</h5>
              <span className="text-muted fs-13">Fiscalization gateway environment and credentials.</span>

              <div className="d-flex align-items-center justify-content-between mt-3 mb-3 p-3 rdx-env-toggle">
                <div>
                  <div className="fw-medium">Environment</div>
                  <div className="text-muted fs-13">Switch between FBR sandbox and production</div>
                </div>
                <div className="form-check form-switch fs-3 mb-0">
                  <Input
                    type="checkbox"
                    role="switch"
                    className="form-check-input"
                    checked={form.fbrEnvironment === "Production"}
                    onChange={toggleEnvironment}
                  />
                </div>
              </div>

              <span
                className={`rdx-chip mb-3 bg-${form.fbrEnvironment === "Production" ? "success" : "warning"}-subtle text-${
                  form.fbrEnvironment === "Production" ? "success" : "warning"
                }`}
              >
                <i className="ri-shield-check-line"></i> {form.fbrEnvironment} mode active
              </span>

              <Label className="form-label">API Key</Label>
              <Input value={form.fbrApiKey} onChange={update("fbrApiKey")} />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
            <i className="ri-save-3-line"></i> Save Changes
          </button>
        </div>
      </form>
    </RedesignLayout>
  );
};

export default Settings;
