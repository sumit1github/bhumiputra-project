import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from 'react-toastify';
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone
} from 'react-icons/fa';
import { useSelector } from 'react-redux';


import { Checkbox } from "../../common_components/form_component/Checkbox";

import { InviteUser } from "./auth_calls";

import "./UserAdd.css";
import AdminLayout from "../IT-Dashboard/AdminLayout";

const UserAdd = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parent = searchParams.get("parent");
  const parent_name = searchParams.get("name");

  const GENDER_OPTIONS = [
    { value: 'MALE', label: 'MALE' },
    { value: 'FEMALE', label: 'FEMALE' },
    { value: 'OTHER', label: 'OTHER' },
  ];

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: '',
    password: '',
    confirm_password: '',
    email: '',
    contact1: '',
    contact2: '',
    date_joined: '',
    age: '',
    dob: '',
    gender: 'MALE',
    address: '',
    zip_code: '',
    parent: parent || '',
    is_active: true,
    invite_tokens: 0,
    is_distributer: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Custom hook for user invite

  const {
    mutate: inviteUser,
    isLoading,
    isError,
    error,
    data,
  } = InviteUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    inviteUser(formData, {
      onSuccess: (data) => {
        if (data?.status === 200) {
          console.log("User added successfully:", data);
          setFormErrors({});
          toast.success("User added successfully!");
          navigate("/users");

        } else if (data?.status === 400 && data?.error) {

          if (data?.error) {
            setFormErrors(data.error); // field-level errors
          }

          if (data?.message && data?.logout) {
            toast.error(data.message); // general error message
            localStorage.removeItem("accessToken");
            navigate("/login");
          }

        }
      },

      onError: (err) => {
        if (err?.response?.data?.error) {
          setFormErrors(err.response.data.error);
        } else {
          setFormErrors({ general: "Something went wrong." });
        }
        toast.error("Failed to invite user.");
      },
    });
  };

  useEffect(() => {
    if (!userData?.user?.roles?.includes('ADMIN') && !userData?.user?.roles?.includes('IT')) {
      if (userData?.user?.invite_tokens <= 0) {
        toast.error("You don't have enough Join-Pins to add a user.");
        navigate("/users");
      }
    }
  }, [userData])


  return (
    <AdminLayout>

      <div className="bhumi_putra_form">
        <div className="container">
          <div className="main-container">

            <div className="form-header">
              <h2><FaUserPlus className="me-3" />User Registration</h2>
              <p className="subtitle">Invite User</p>
            </div>

            <div className="form-body">
              <form id="userRegistrationForm" onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="form-section">
                  <h3 className="section-title">Personal Information</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Full Name <span className="required">*</span></label>
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Enter your full name" id="full_name" name="full_name" onChange={handleChange} value={formData.full_name} required />
                          <span className="input-icon"><FaUser /></span>
                        </div>
                        {formErrors.full_name && <div className="text-danger">{formErrors.full_name}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Email <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Email" />
                          <span className="input-icon"><FaEnvelope /></span>
                        </div>
                        {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Gender <span className="required">*</span></label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                          {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                        {formErrors.gender && <div className="text-danger">{formErrors.gender}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Date of Birth <span className="required">*</span></label>
                        <input id="dob" type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" />
                        {formErrors.dob && <div className="text-danger">{formErrors.dob}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="form-section">
                  <h3 className="section-title">Security Information</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Password <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Password" />
                          <span className="input-icon"><FaLock /></span>
                        </div>
                        {formErrors.password && <div className="text-danger">{formErrors.password}</div>}

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Confirm Password <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="confirm_password" type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="form-control" placeholder="Confirm Password" />
                          <span className="input-icon"><FaLock /></span>
                        </div>
                        {formErrors.confirm_password && <div className="text-danger">{formErrors.confirm_password}</div>}

                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="form-section">
                  <h3 className="section-title">Contact Information</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Primary Contact <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="contact1" name="contact1" value={formData.contact1} onChange={handleChange} className="form-control" placeholder="Primary contact" />
                          <span className="input-icon"><FaPhone /></span>
                        </div>
                        {formErrors.contact1 && <div className="text-danger">{formErrors.contact1}</div>}

                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Secondary Contact</label>
                        <div className="input-group">
                          <input id="contact2" name="contact2" value={formData.contact2} onChange={handleChange} className="form-control" placeholder="Secondary contact" />
                          <span className="input-icon"><FaPhone /></span>
                        </div>
                        {formErrors.contact2 && <div className="text-danger">{formErrors.contact2}</div>}

                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Pin Code <span className="required">*</span></label>
                        <input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} className="form-control" />
                      </div>
                      {formErrors.zip_code && <div className="text-danger">{formErrors.zip_code}</div>}

                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Date Joined <span className="required">*</span></label>
                        <input id="date_joined" name="date_joined" type="datetime-local" value={formData.date_joined} onChange={handleChange} className="form-control" />
                      </div>
                      {formErrors.date_joined && <div className="text-danger">{formErrors.date_joined}</div>}

                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address <span className="required">*</span></label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} className="form-control" rows={2}></textarea>
                    {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="form-section">
                  <h3 className="section-title">Additional Information</h3>
                  <div className="row">

                    <div className="col-md-3">
                      <div className="form-group parent-info">
                        <label className="form-label">Parent User ID <span className="required">*</span><span style={{ color: "green" }}> (Parent Name: {parent_name || ""})</span></label>
                        <input id="parent" name="parent" value={formData.parent} onChange={handleChange} className="form-control" placeholder="e.g. 123" readOnly={true} />
                        {formErrors.parent && <div className="text-danger">{formErrors.parent}</div>}
                        <div className="hint-text">Parent Name will be displayed based on ID</div>
                      </div>
                    </div>

                    {(
                      userData?.user?.roles?.includes('ADMIN') ||
                      userData?.user?.roles?.includes('IT')
                    ) && (
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="form-label">Invite Tokens <span className="required">*</span></label>
                            <input id="invite_tokens" name="invite_tokens" value={formData.invite_tokens} onChange={handleChange} className="form-control" />
                          </div>
                          {formErrors.invite_tokens && <div className="text-danger">{formErrors.invite_tokens}</div>}

                        </div>
                      )}

                    {(
                      userData?.user?.roles?.includes('ADMIN') ||
                      userData?.user?.roles?.includes('IT')
                    ) && (
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="form-label">Account Status</label>
                            <div className="d-flex align-items-center mt-2">
                              <Checkbox
                                name="is_active"
                                id="is_active"
                                value={formData.is_active}
                                onchangeFunction={handleChange}
                              />
                            </div>
                            <div className="hint-text">Active for login</div>
                          </div>
                        </div>
                      )}

                    {(
                      userData?.user?.roles?.includes('ADMIN') ||
                      userData?.user?.roles?.includes('IT')
                    ) && (
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="form-label">Is Distributer?</label>
                            <div className="d-flex align-items-center mt-2">
                              <Checkbox
                                name="is_distributer"
                                id="is_distributer"
                                value={formData.is_distributer}
                                onchangeFunction={handleChange}
                              />
                            </div>
                            <div className="hint-text">Mark as distributer</div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-4">
                  <button type="submit" className="submit-btn">
                    <FaUserPlus className="me-2" />Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
};

export default UserAdd;
