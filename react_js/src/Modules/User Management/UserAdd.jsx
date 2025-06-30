import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';

import { InviteUser } from "./auth_calls";

import "./UserAdd.css";
import AdminLayout from "../IT-Dashboard/AdminLayout";

const UserAdd = () => {
  const navigate = useNavigate();

  const GENDER_OPTIONS = [
    { value: 'MALE', label: 'MALE' },
    { value: 'FEMALE', label: 'FEMALE' },
    { value: 'OTHER', label: 'OTHER' },
  ];

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: '',
    password: '',
    confirm_password:'',
    email: '',
    contact1: '',
    contact2: '',
    date_joined: '',
    age: '',
    dob: '',
    gender: '',
    address: '',
    zip_code: '',
    parent: '',
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

          setFormErrors(data.error); // field-level errors
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



  return (
    <AdminLayout>
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-header text-white rounded-top-4" style={{ background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}>
            <h4 className="mb-0 py-2">📝 User Add Form</h4>
          </div>
          <div className="card-body p-4">
            
            <form onSubmit={handleSubmit}>
              <div className="row g-4">

                {/* Basic Info */}
                <div className="col-md-6">
                  <label htmlFor="full_name">Full Name <span className="required">*</span></label>
                  <input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} className="form-control" placeholder="Full name" />
                  {formErrors.full_name && <div className="text-danger">{formErrors.full_name}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="password">Password <span className="required">*</span></label>
                  <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Password" />
                  {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="confirm_password">Confirm Password <span className="required">*</span></label>
                  <input id="confirm_password" type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="form-control" placeholder="Confirm Password" />
                  {formErrors.confirm_password && <div className="text-danger">{formErrors.confirm_password}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Email" />
                  {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="contact1">Contact 1 <span className="required">*</span></label>
                  <input id="contact1" name="contact1" value={formData.contact1} onChange={handleChange} className="form-control" placeholder="Primary contact" />
                  {formErrors.contact1 && <div className="text-danger">{formErrors.contact1}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="contact2">Contact 2</label>
                  <input id="contact2" name="contact2" value={formData.contact2} onChange={handleChange} className="form-control" placeholder="Secondary contact" />
                  {formErrors.contact2 && <div className="text-danger">{formErrors.contact2}</div>}
                </div>

                {/* Date & Time */}
                <div className="col-md-6">
                  <label htmlFor="date_joined">Date Joined <span className="required">*</span></label>
                  <input id="date_joined" name="date_joined" type="datetime-local" value={formData.date_joined} onChange={handleChange} className="form-control" />
                  {formErrors.date_joined && <div className="text-danger">{formErrors.date_joined}</div>}
                </div>

                {/* Personal Info */}
                <div className="col-md-3">
                  <label htmlFor="age">Age <span className="required">*</span></label>
                  <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} className="form-control" />
                  {formErrors.age && <div className="text-danger">{formErrors.age}</div>}
                </div>

                <div className="col-md-3">
                  <label htmlFor="dob">Date of Birth <span className="required">*</span></label>
                  <input id="dob" type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" />
                  {formErrors.dob && <div className="text-danger">{formErrors.dob}</div>}
                </div>

                <div className="col-md-3">
                  <label htmlFor="gender">Gender <span className="required">*</span></label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                    {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                  {formErrors.gender && <div className="text-danger">{formErrors.gender}</div>}
                </div>

                <div className="col-md-3">
                  <label htmlFor="zip_code">Pin Code <span className="required">*</span></label>
                  <input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} className="form-control" />
                  {formErrors.zip_code && <div className="text-danger">{formErrors.zip_code}</div>}
                </div>

                <div className="col-md-12">
                  <label htmlFor="address">Address <span className="required">*</span></label>
                  <textarea id="address" name="address" value={formData.address} onChange={handleChange} className="form-control" rows={2}></textarea>
                  {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="parent">Parent User ID <span className="required">*</span></label>
                  <input id="parent" name="parent" value={formData.parent} onChange={handleChange} className="form-control" placeholder="e.g. 123" />
                  {formErrors.parent && <div className="text-danger">{formErrors.parent}</div>}
                </div>

              </div>

              <div className="text-end mt-5">
                <button className="btn btn-primary px-4 py-2 rounded-pill shadow" type="submit">Submit</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserAdd;
