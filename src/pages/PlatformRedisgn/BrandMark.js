import React from "react";

const BrandMark = ({ withWordmark = false, size = 40 }) => (
  <div className="rdx-logo">
    <span className="rdx-logo-tile" style={{ width: size, height: size, fontSize: size * 0.46 }}>
      <i className="ri-bill-line"></i>
    </span>
    {withWordmark && (
      <span className="rdx-logo-word">
        FBR <strong>Invoicing</strong>
      </span>
    )}
  </div>
);

export default BrandMark;
