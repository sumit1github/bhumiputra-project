import React, { useState } from "react";
import { Link } from "react-router";

import "./Register.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      <div className="container-fluid signup-container">
        <div className="row h-100">
          {/* Left Section - Empty placeholder for image */}
          <div className="col-lg-6 left-section d-none d-lg-flex">
            <img src="/register/hero.png" />
          </div>

          {/* Right Section - Sign Up Form */}
          <div className="col-12 col-lg-6 right-section">
            <div className="form-container">
              {/* Header */}
              <div>
                <h1 className="signup-title">Sign Up</h1>
                <p className="signup-subtitle">
                  Enter details to create your account
                </p>
              </div>

              {/* Sign Up Form */}
              <div>
                {/* Username Field */}
                <div className="form-group">
                  <div className="form-label">Username*</div>
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
                  <div className="form-label">Password*</div>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      placeholder="Enter password"
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

                {/* Confirm Password Field */}
                <div className="form-group">
                  <div className="form-label">Confirm Password*</div>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      placeholder="Confirm password"
                    />
                    <div
                      className="input-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <i
                        className={`fas ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="terms-check p-4 pl-0">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="form-check-input"
                    id="agreeTerms"
                  />
                  <label className="terms-label" htmlFor="agreeTerms">
                    I have read and agree to the{" "}
                    <Link className="text-underline">terms of service</Link>
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      formData.agreeTerms &&
                      formData.password === formData.confirmPassword
                    ) {
                      console.log("Account creation attempted:", formData);
                    }
                  }}
                  className="login-btn"
                  disabled={
                    !formData.agreeTerms ||
                    formData.password !== formData.confirmPassword
                  }
                >
                  Create account
                </button>

                {/* Login Link */}
                <div className="login-link">
                  <span>Already have an account? </span>
                  <Link to={"/"} className="text-underline">
                    Login
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

export default Register;
