import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router";
import {
  FaUserPlus,
} from 'react-icons/fa';


import AdminLayout from "../IT-Dashboard/AdminLayout";
import { productCreate } from "./product_calls";

export const ProductAdd = () => {
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    brand: '',
    buy_price: 0,
    sell_price: 0,
    stock: 1,
  });


  //  -------------- product update -----------------


  const {
    mutate: createProduct,
    data: ProductCreateData,
    isLoading: createIsLoading,
    isError: createIsError,
    error: createError,
  } = productCreate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createProduct(formData, {
      onSuccess: (data) => {
        if (data?.status === 200) {
          setFormErrors({});
          toast.success("Product Added successfully!");
          navigate("/products/list");
        } else if (data?.status === 400 && data?.error) {
          console.log("Error data:", data.error);
          setFormErrors(data.error);
        }
      },

      onError: (err) => {
        if (err?.response?.data?.error) {
          setFormErrors(err.response.data.error);
        } else {
          setFormErrors({ general: "Something went wrong." });
        }
      },
    });

  };

  return (
    <AdminLayout>
      <div className="bhumi_putra_form">
        <div className="container">
          <div className="main-container">

            <div className="form-header">
              <h2><FaUserPlus className="me-3" />Product Management</h2>
              <p className="subtitle">Add Product</p>
            </div>

            <div className="form-body">
              <form id="userRegistrationForm" onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="form-section">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">PID <span className="required">*</span></label>
                        <div className="input-group">
                          <input type="text" className="form-control" name="uid" id="uid" placeholder="Enter your Product ID" onChange={handleChange} value={formData.uid} required />
                        </div>
                        {formErrors.uid && <div className="text-danger">{formErrors.uid}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">name <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="name" />
                        </div>
                        {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">brand <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="brand" type="text" name="brand" value={formData.brand} onChange={handleChange} className="form-control" placeholder="brand" />
                        </div>
                        {formErrors.brand && <div className="text-danger">{formErrors.brand}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">buy_price <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="buy_price" type="number" name="buy_price" value={formData.buy_price} onChange={handleChange} className="form-control" placeholder="buy_price" />
                        </div>
                        {formErrors.buy_price && <div className="text-danger">{formErrors.buy_price}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">sell_price <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="sell_price" type="number" name="sell_price" value={formData.sell_price} onChange={handleChange} className="form-control" placeholder="sell_price" />
                        </div>
                        {formErrors.sell_price && <div className="text-danger">{formErrors.sell_price}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">stock <span className="required">*</span></label>
                        <div className="input-group">
                          <input id="stock" type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-control" placeholder="stock" />
                        </div>
                        {formErrors.stock && <div className="text-danger">{formErrors.stock}</div>}
                      </div>
                    </div>

                  </div>
                </div>


                {/* Submit Button */}
                <div className="text-center mt-4">
                  <button type="submit" className="submit-btn">
                    <FaUserPlus className="me-2" />Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout >
  );
};
