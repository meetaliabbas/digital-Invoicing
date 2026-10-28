import React, { useEffect, useMemo, useState } from "react";
import { Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";
import RedesignLayout from "./RedesignLayout";
import { buyers, hsCodeOptions, uomOptions, provinceOptions, tenants, emptyInvoiceItem } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const steps = [
  { id: 1, label: "Buyer & Tenant" },
  { id: 2, label: "Line Items" },
  { id: 3, label: "Tax & FBR Fields" },
  { id: 4, label: "Review & Post" },
];

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { activeTenant } = useTenant();
  const [step, setStep] = useState(1);
  const [buyerId, setBuyerId] = useState(buyers[0].id);
  const [tenantId, setTenantId] = useState(activeTenant.id);
  const [province, setProvince] = useState(provinceOptions[0]);
  const [items, setItems] = useState([emptyInvoiceItem()]);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    setTenantId(activeTenant.id);
  }, [activeTenant]);

  const buyer = buyers.find((b) => b.id === buyerId);
  const tenant = tenants.find((t) => t.id === tenantId);

  const updateItem = (id, field, value) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, emptyInvoiceItem()]);
  const removeItem = (id) => setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const value = Number(item.qty || 0) * Number(item.rate || 0);
        const tax = value * (Number(item.taxRate || 0) / 100);
        acc.subtotal += value;
        acc.tax += tax;
        return acc;
      },
      { subtotal: 0, tax: 0 },
    );
  }, [items]);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handlePost = () => {
    setPosted(true);
    setTimeout(() => navigate("/platform/invoices"), 1200);
  };

  return (
    <RedesignLayout title="New Invoice" subtitle="Create and fiscalize a sale invoice in a few guided steps.">
      <div className="rdx-card p-4">
        <div className="rdx-stepper mb-4">
          {steps.map((s) => (
            <div key={s.id} className={`rdx-step ${step === s.id ? "active" : step > s.id ? "done" : ""}`}>
              {step > s.id ? <i className="ri-check-line"></i> : <span>{s.id}</span>}
              {s.label}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="row g-3" style={{ maxWidth: 640 }}>
            <div className="col-md-6">
              <Label className="form-label">Tenant / Business</Label>
              <Input type="select" value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Input>
            </div>
            <div className="col-md-6">
              <Label className="form-label">Buyer</Label>
              <Input type="select" value={buyerId} onChange={(e) => setBuyerId(e.target.value)}>
                {buyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.ntn})
                  </option>
                ))}
              </Input>
            </div>
            <div className="col-md-6">
              <Label className="form-label">Buyer NTN / CNIC</Label>
              <Input value={buyer?.ntn || ""} readOnly />
            </div>
            <div className="col-md-6">
              <Label className="form-label">Buyer City</Label>
              <Input value={buyer?.city || ""} readOnly />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="text-muted fs-12 text-uppercase">
                    <th style={{ minWidth: 180 }}>HS Code</th>
                    <th style={{ minWidth: 200 }}>Description</th>
                    <th style={{ width: 90 }}>Qty</th>
                    <th style={{ width: 100 }}>UoM</th>
                    <th style={{ width: 130 }}>Rate (PKR)</th>
                    <th style={{ width: 110 }}>Tax %</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Input
                          type="select"
                          value={item.hsCode}
                          onChange={(e) => updateItem(item.id, "hsCode", e.target.value)}
                        >
                          <option value="">Select HS Code</option>
                          {hsCodeOptions.map((hs) => (
                            <option key={hs.code} value={hs.code}>
                              {hs.code}
                            </option>
                          ))}
                        </Input>
                      </td>
                      <td>
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                        />
                      </td>
                      <td>
                        <Input type="select" value={item.uom} onChange={(e) => updateItem(item.id, "uom", e.target.value)}>
                          {uomOptions.map((uom) => (
                            <option key={uom} value={uom}>
                              {uom}
                            </option>
                          ))}
                        </Input>
                      </td>
                      <td>
                        <Input
                          type="number"
                          min={0}
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          min={0}
                          value={item.taxRate}
                          onChange={(e) => updateItem(item.id, "taxRate", e.target.value)}
                        />
                      </td>
                      <td>
                        <button type="button" className="btn btn-sm btn-light text-danger" onClick={() => removeItem(item.id)}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addItem}>
              <i className="ri-add-line align-middle"></i> Add Line Item
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="row g-3" style={{ maxWidth: 640 }}>
            <div className="col-md-6">
              <Label className="form-label">Place of Supply</Label>
              <Input type="select" value={province} onChange={(e) => setProvince(e.target.value)}>
                {provinceOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Input>
            </div>
            <div className="col-md-6">
              <Label className="form-label">Invoice Type</Label>
              <Input type="select" defaultValue="Sale Invoice">
                <option>Sale Invoice</option>
                <option>Debit Note</option>
                <option>Credit Note</option>
              </Input>
            </div>
            <div className="col-md-6">
              <Label className="form-label">Sales Tax Withheld At Source</Label>
              <Input type="select" defaultValue="No">
                <option>Yes</option>
                <option>No</option>
              </Input>
            </div>
            <div className="col-md-6">
              <Label className="form-label">Reference Invoice # (optional)</Label>
              <Input placeholder="e.g. INV-100230" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="rdx-card p-3">
                  <div className="text-muted fs-13 mb-1">Tenant</div>
                  <div className="fw-semibold">{tenant?.name}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="rdx-card p-3">
                  <div className="text-muted fs-13 mb-1">Buyer</div>
                  <div className="fw-semibold">
                    {buyer?.name} &middot; {buyer?.ntn}
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive mb-3">
              <table className="table align-middle">
                <thead>
                  <tr className="text-muted fs-12 text-uppercase">
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Tax %</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const amount = Number(item.qty || 0) * Number(item.rate || 0);
                    return (
                      <tr key={item.id}>
                        <td>{item.description || "Untitled item"}</td>
                        <td>
                          {item.qty} {item.uom}
                        </td>
                        <td>{Number(item.rate || 0).toLocaleString()}</td>
                        <td>{item.taxRate}%</td>
                        <td className="text-end">{amount.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end">
              <div style={{ minWidth: 260 }}>
                <div className="d-flex justify-content-between fs-13 mb-1">
                  <span className="text-muted">Subtotal</span>
                  <span>PKR {totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between fs-13 mb-1">
                  <span className="text-muted">Sales Tax</span>
                  <span>PKR {totals.tax.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between fw-semibold fs-16 border-top pt-2 mt-2">
                  <span>Total Payable</span>
                  <span>PKR {(totals.subtotal + totals.tax).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {posted && (
              <div className="alert alert-success d-flex align-items-center gap-2 mt-3 mb-0">
                <i className="ri-checkbox-circle-line fs-18"></i>
                Invoice submitted to FBR for fiscalization. Redirecting to invoices&hellip;
              </div>
            )}
          </div>
        )}

        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
          <button type="button" className="btn btn-outline-secondary" onClick={goBack} disabled={step === 1}>
            Back
          </button>
          {step < steps.length ? (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn btn-success d-flex align-items-center gap-1" onClick={handlePost} disabled={posted}>
              <i className="ri-send-plane-line"></i> Post to FBR
            </button>
          )}
        </div>
      </div>
    </RedesignLayout>
  );
};

export default CreateInvoice;
