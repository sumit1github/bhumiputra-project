import React, { useState } from "react";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

import "./Login.css";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "admin",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="container-fluid login-container">
        <div className="row h-100">
          {/* Left Section - Empty placeholder for image */}
          <div className="col-lg-6 left-section d-none d-lg-flex">
            <img src="/login/hero.png" alt="Hero-image" />
          </div>

          {/* Right Section - Login Form */}
          <div className="col-12 col-lg-6 right-section">
            <div className="form-container">
              {/* Header */}
              <div className="text-center">
                <h1 className="welcome-title">Welcome to Luxuria!</h1>

                {/* Tab Buttons */}
                <div className="tab-buttons">
                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`tab-btn admin ${
                      activeTab === "admin" ? "active" : ""
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => setActiveTab("employee")}
                    className={`tab-btn employee ${
                      activeTab === "employee" ? "active" : ""
                    }`}
                  >
                    Employee
                  </button>
                </div>
              </div>

              {/* Sign In Form */}
              <div>
                <h2 className="sign-in-title">Sign in</h2>

                <div>
                  {/* Username Field */}
                  <div className="form-group">
                    {/* <div className="form-label">username: {activeTab}*</div> */}
                    <div className="input-group">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="Enter username"
                      />
                      <div className="help-icon">
                        <span>?</span>
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    {/* <div className="form-label">password: {activeTab}*</div> */}
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="••••"
                      />
                      <div
                        className="input-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`fas ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </div>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="form-check-row">
                    <div className="form-check-custom">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember Me
                      </label>
                    </div>
                    <Link className="forgot-password">Forgot Password?</Link>
                  </div>

                  {/* Login Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Login attempted:", formData);
                      handleLogin();
                    }}
                    className="login-btn"
                  >
                    Login
                  </button>
                </div>

                {/* Social Login */}
                <div className="social-login">
                  <button className="social-btn google-btn">G</button>
                  <button className="social-btn apple-btn">
                    <FaApple />
                  </button>
                  <button className="social-btn facebook-btn">f</button>
                </div>

                {/* Sign Up Link */}
                <div className="signup-link">
                  <span>Don't have an account? </span>
                  <Link className="signup-btn text-underline" to={"/register"}>
                    Click here to create one
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
