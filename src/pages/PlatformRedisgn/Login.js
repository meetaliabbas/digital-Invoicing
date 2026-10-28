import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Label, Button, Spinner } from "reactstrap";
import BrandMark from "./BrandMark";
import fbrBadge from "../../assets/images/fbr-logo-new.png";
import "./redesign.scss";

const highlights = [
  { icon: "ri-building-4-line", title: "Multi-Tenant Ready", text: "Onboard unlimited businesses under one secure workspace." },
  { icon: "ri-shield-check-line", title: "FBR Fiscalization", text: "Real-time invoice validation and posting to FBR." },
  { icon: "ri-line-chart-line", title: "Live Compliance Insights", text: "Track rejections, tax collected and filing health instantly." },
];

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/platform/dashboard");
    }, 600);
  };

  return (
    <div className="rdx-auth-page">
      <div className="rdx-auth-brand">
        <div className="rdx-auth-grid"></div>

        <BrandMark withWordmark size={40} />

        <div className="d-flex align-items-center gap-4 flex-wrap flex-lg-nowrap">
          <div>
            <h1 className="fw-bold mb-3" style={{ fontSize: "2.1rem" }}>
              Multi-Tenant FBR Digital Invoicing &amp; Fiscalization Platform
            </h1>
            <p className="opacity-75 mb-4" style={{ maxWidth: 440 }}>
              One workspace to issue, validate and fiscalize invoices across every tenant business you manage.
            </p>

            <div className="d-flex flex-column gap-3">
              {highlights.map((item) => (
                <div className="d-flex gap-3" key={item.title}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)" }}
                  >
                    <i className={`${item.icon} fs-18`}></i>
                  </div>
                  <div>
                    <div className="fw-semibold">{item.title}</div>
                    <div className="opacity-75 fs-13">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rdx-auth-mock d-none d-xl-block">
            <div className="rdx-auth-mock-row">
              <div className="rdx-auth-mock-dot">
                <i className="ri-file-text-line"></i>
              </div>
              <span className="rdx-auth-mock-chip">
                <i className="ri-checkbox-circle-fill"></i> Fiscalized
              </span>
            </div>
            <div className="rdx-auth-mock-bars mb-3">
              <div className="rdx-auth-mock-bar w-70"></div>
              <div className="rdx-auth-mock-bar w-45"></div>
            </div>
            <div className="d-flex justify-content-between align-items-end">
              <div className="rdx-auth-mock-bars" style={{ flex: 1 }}>
                <div className="rdx-auth-mock-bar w-90"></div>
                <div className="rdx-auth-mock-bar w-45"></div>
              </div>
              <span className="fw-bold fs-18 ms-3">PKR 452,300</span>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <img src={fbrBadge} alt="FBR" height={38} style={{ background: "#fff", borderRadius: 8, padding: 4 }} />
          <span className="opacity-75 fs-13">Integrated with the Federal Board of Revenue e-invoicing gateway</span>
        </div>
      </div>

      <div className="rdx-auth-form">
        <div className="rdx-auth-form-card">
          <span className="rdx-demo-badge">
            <i className="ri-sparkling-2-fill"></i> Demo mode &middot; any email &amp; password works
          </span>
          <h4 className="fw-semibold mb-1">Welcome back</h4>
          <p className="text-muted mb-4">Sign in to your tenant workspace to continue.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Label htmlFor="rdx-email" className="form-label">
                Work email
              </Label>
              <div className="rdx-input-icon">
                <i className="ri-mail-line"></i>
                <Input
                  id="rdx-email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <Label htmlFor="rdx-password" className="form-label">
                  Password
                </Label>
                <a href="#!" className="fs-13 text-decoration-none">
                  Forgot password?
                </a>
              </div>
              <div className="rdx-input-icon">
                <i className="ri-lock-2-line"></i>
                <Input
                  id="rdx-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
                <button
                  type="button"
                  className="rdx-input-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
            </div>

            <div className="form-check mb-4">
              <Input type="checkbox" className="form-check-input" id="rdx-remember" />
              <Label className="form-check-label" htmlFor="rdx-remember">
                Keep me signed in on this device
              </Label>
            </div>

            <Button color="primary" className="w-100 d-flex align-items-center justify-content-center gap-2" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : <i className="ri-login-circle-line"></i>}
              Sign In
            </Button>
          </form>

          <p className="text-muted text-center mt-4 mb-0 fs-13">
            Multi-Tenant FBR Digital Invoicing &amp; Fiscalization Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
