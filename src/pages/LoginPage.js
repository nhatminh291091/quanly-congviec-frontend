import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    window.google.accounts.id.initialize({
      client_id: "52169199368-47af28pkqfq60a01jn23u6ssiad99o51.apps.googleusercontent.com", // 👈 điền Client ID của bạn
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    const googleToken = response.credential;
    const success = await login(googleToken);

    if (success) {
      navigate('/dashboard');
    } else {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          {/* icon SVG của bạn */}
        </div>
        <h1 className="login-title">Hệ Thống Quản Lý Công Việc</h1>
        <p className="text-center mb-4">Đăng nhập để tiếp tục</p>

        <div id="google-signin-btn" className="flex justify-center"></div>

        <div className="login-footer mt-4">
          <p className="text-center text-secondary">© 2025 Hệ Thống Quản Lý Công Việc</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
