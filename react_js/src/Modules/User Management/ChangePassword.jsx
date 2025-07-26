import React, { useState, useEffect } from 'react'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify';


import AdminLayout from "../IT-Dashboard/AdminLayout";
import './ChangePassword.css';
import { UserPassChangeApiCall } from "./auth_calls";
import { logOut } from "../Auth/auth_calls";

export const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.oldPassword.trim()) {
            errors.oldPassword = 'Old password is required';
        }

        if (!formData.newPassword.trim()) {
            errors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = 'New password must be at least 8 characters long';
        }

        if (!formData.confirmPassword.trim()) {
            errors.confirmPassword = 'Confirm password is required';
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (formData.oldPassword === formData.newPassword) {
            errors.newPassword = 'New password must be different from old password';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const { mutate: chnagePassCall, data: chnagePassData, isLoading: chnagePassIsLoading, isError: chnagePassIsError, error: chnagePassError } = UserPassChangeApiCall();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            chnagePassCall(formData);

            // Reset form on success
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const { mutate: logout, } = logOut();

    useEffect(() => {
        if (chnagePassData) {
            console.log('Change password response:', chnagePassData);
            if (chnagePassData?.status === 200) {
                toast.success("Password changed successfully!");

                logout();
                localStorage.removeItem("accessToken");
                navigate("/login");

            } else {
                toast.error(chnagePassData?.message || "Failed to change password. Please try again.");
            }
        }


    }, [chnagePassData])

    return (
        <AdminLayout>
            <div className="change-password-container">
                <div className="change-password-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <FaLock className="title-icon" />
                            Change Password
                        </h2>
                        <p className="card-subtitle">
                            Enter your current password and choose a new secure password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="change-password-form">
                        {/* Old Password Field */}
                        <div className="form-group">
                            <label className="form-label">
                                Current Password <span className="required">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPasswords.oldPassword ? "text" : "password"}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className={`form-control ${formErrors.oldPassword ? 'error' : ''}`}
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => togglePasswordVisibility('oldPassword')}
                                >
                                    {showPasswords.oldPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formErrors.oldPassword && (
                                <div className="error-message">{formErrors.oldPassword}</div>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div className="form-group">
                            <label className="form-label">
                                New Password <span className="required">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPasswords.newPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`form-control ${formErrors.newPassword ? 'error' : ''}`}
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => togglePasswordVisibility('newPassword')}
                                >
                                    {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formErrors.newPassword && (
                                <div className="error-message">{formErrors.newPassword}</div>
                            )}
                            <div className="password-requirements">
                                <small>Password must be at least 8 characters long</small>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label className="form-label">
                                Confirm New Password <span className="required">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPasswords.confirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-control ${formErrors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                >
                                    {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formErrors.confirmPassword && (
                                <div className="error-message">{formErrors.confirmPassword}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Changing Password...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => {
                                    setFormData({
                                        oldPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                    setFormErrors({});
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    {/* Security Tips */}
                    <div className="security-tips">
                        <h4>Security Tips:</h4>
                        <ul>
                            <li>Use a combination of uppercase and lowercase letters</li>
                            <li>Include numbers and special characters</li>
                            <li>Avoid using personal information</li>
                            <li>Don't reuse passwords from other accounts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
