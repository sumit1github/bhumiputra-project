import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../../store/Slices/Room/UserSlice";
import "./login.css";
import { useLogin } from "../auth_calls"; // Assuming you have a custom hook for login

const Login = () => {
  const dispatch = useDispatch();
  const { mutate: login, isLoading, isError, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    login(formData, {
      onSuccess: (data) => {
        console.log("Login successful:", data);
        dispatch(loginSuccess(data));
        navigate("/users");
      },
    });
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="container-fluid login-container">
      <div className="row h-100">
        {/* Left Section - Hero Content */}
        <div className="col-lg-6 left-section d-none d-lg-flex">
          <div className="hero-content">
            <div className="hero-title">
              Welcome to<br />Bhumiputra
            </div>
            <div className="hero-subtitle">
              A unit for commercial, economic, and social empowerment.
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <span>Secure & Trusted</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <span>Eco-Friendly</span>
              </div>
            </div>
          </div>

          {/* Floating decorative elements */}
          <div className="decorative-elements">
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>
            <div className="floating-shape"></div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="col-12 col-lg-6 right-section">
          <div className="form-container">
            {/* Brand Logo */}
            <div className="brand-logo">
              <div className="logo-circle">
                <img src="/logo.png" alt="Profile_pic" className="person-image-2 border" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="welcome-title">Welcome Back!</h1>
              <p className="welcome-subtitle">
                Please sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {isError && error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error.message || "Login failed. Please try again."}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">Email Or Phone Number</label>
                <div className="input-group">
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter your email or phone number"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <div
                    className="input-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    ></i>
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="forgot-password-link">
                <a href="#" className="forgot-password">
                  Forgot your password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
