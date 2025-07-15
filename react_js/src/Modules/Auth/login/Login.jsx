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

    login(formData, {
      onSuccess: (data) => {
        console.log("Login successful:", data);
        dispatch(loginSuccess(data));
        navigate("/users");
      },
    });
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
                <h1 className="welcome-title">Welcome to Bhumiputra!</h1>
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
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="Enter Email"
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
                          className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                        ></i>
                      </div>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    onClick={(e) => { handleLogin(); }}
                    className="login-btn"
                  >
                    Login
                  </button>
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
