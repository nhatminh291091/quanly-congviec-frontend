
import React from "react";
import { useNavigate } from "react-router-dom";
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleAccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="landing-container">
      <h1>Hệ Thống Quản Lý Công Việc</h1>
      <p>Phòng Thanh tra giáo dục</p>
      <button className="access-button" onClick={handleAccess}>Truy cập hệ thống</button>
    </div>
  );
};

export default LandingPage;
