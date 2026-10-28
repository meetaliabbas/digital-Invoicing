import React, { useMemo, useState } from "react";
import RedesignLayout from "./RedesignLayout";
import { notifications as notificationSeed } from "./data";
import { useTenant } from "./TenantContext";
import "./redesign.scss";

const typeColor = { success: "success", danger: "danger", warning: "warning", info: "primary" };
const filters = ["All", "success", "warning", "danger"];
const filterLabel = { All: "All", success: "Success", warning: "Warnings", danger: "Rejections" };

const Notifications = () => {
  const { activeTenant } = useTenant();
  const [items, setItems] = useState(notificationSeed);
  const [filter, setFilter] = useState("All");

  const tenantItems = useMemo(
    () => items.filter((n) => n.tenant === activeTenant.name || n.tenant === "Platform"),
    [items, activeTenant],
  );

  const filtered = useMemo(
    () => tenantItems.filter((n) => filter === "All" || n.type === filter),
    [tenantItems, filter],
  );

  const unreadCount = tenantItems.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => (n.tenant === activeTenant.name || n.tenant === "Platform" ? { ...n, read: true } : n)));
  const toggleRead = (id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <RedesignLayout
      title="Notifications"
      subtitle={`FBR submission activity and alerts for ${activeTenant.name}. ${unreadCount} unread.`}
      actions={
        <button type="button" className="btn btn-outline-primary d-flex align-items-center gap-1" onClick={markAllRead}>
          <i className="ri-check-double-line"></i> Mark all as read
        </button>
      }
    >
      <div className="rdx-card p-3 mb-3 d-flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {filterLabel[f]}
          </button>
        ))}
      </div>

      <div className="rdx-card p-2">
        {filtered.map((n) => (
          <div key={n.id} className={`rdx-notif-row ${!n.read ? "unread" : ""}`} onClick={() => toggleRead(n.id)}>
            <div className={`rdx-notif-icon bg-${typeColor[n.type]}-subtle text-${typeColor[n.type]}`}>
              <i className={n.icon}></i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <span className="fw-semibold">{n.title}</span>
                <span className="text-muted fs-12 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-muted fs-13 mb-1">{n.message}</p>
              <span className="text-muted fs-12">{n.tenant}</span>
            </div>
            {!n.read && <span className="rdx-notif-dot"></span>}
          </div>
        ))}

        {filtered.length === 0 && <div className="p-5 text-center text-muted">No notifications in this category.</div>}
      </div>
    </RedesignLayout>
  );
};

export default Notifications;
