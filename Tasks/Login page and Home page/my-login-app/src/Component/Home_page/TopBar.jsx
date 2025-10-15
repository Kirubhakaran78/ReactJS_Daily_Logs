import React from 'react';
import SDMS_Logo from "../../assets/icons/SDMS_Logo.png";

function TopBar() {
  return (
    <div className="topbar d-flex align-items-center justify-content-between px-4 bg-white text-white sticky-top"
         style={{ height: "60px", width: "100%", top: 0, zIndex: 5 }}>

      {/* Left: Logo + Title */}
      <div className="d-flex align-items-center gap-3">
        <img src={SDMS_Logo} alt="SDMS Logo" style={{ height: "40px" }} />
        <h5 className="m-0">SDMS Dashboard</h5>
      </div>

      {/* Right: Info */}
      <div className="d-flex align-items-center gap-4 small">
        <span>Time Zone: Asia/Kolkata (UTC+05:30)</span>
        <span>Domain: SDMS</span>
        <span>Site: Chennai</span>
      </div>
    </div>
  );
}

export default TopBar;
