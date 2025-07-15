import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import {
  FaUserPlus,
} from 'react-icons/fa';


import AdminLayout from "../IT-Dashboard/AdminLayout";
import { productUpdate, productDetailsApiCall } from "./product_calls";
import { Checkbox } from "../../common_components/form_component/Checkbox";

export const ProductUpdate = () => {
  const [formErrors, setFormErrors] = useState({});
  const { product_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    brand: '',
    buy_price: 0,
    sell_price: 0,
    stock: 1,
    is_joining_package: false,
  });

  // -------------- Loading Product Details from API ----------------

  const {
    mutate: getProductDetails,
    data: product_detaildata
  } = productDetailsApiCall();


  useEffect(() => {
    getProductDetails(product_id);
  }, [product_id]);

  useEffect(() => {

    if (product_detaildata) {

      setFormData(prev => ({
        ...prev,
        uid: product_detaildata.product.uid,
        name: product_detaildata.product.name,
        brand: product_detaildata.product.brand,
        buy_price: product_detaildata.product.buy_price,
        sell_price: product_detaildata.product.sell_price,
        stock: product_detaildata.product.stock,
        is_joining_package: product_detaildata.product.is_joining_package || false
      }));
    }
  }, [product_detaildata]);

  //  -------------- product update -----------------


  const {
    mutate: updateProduct,
    data: productUpdatedata
  } = productUpdate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProduct(product_id, formData);
    updateProduct({
      "product_id": product_id,
      "productData": formData
    });

  };

  useEffect(() => {
    if (!productUpdatedata) return;

    if (productUpdatedata.status === 200) {
      toast.success("Product Updated Successfully");
      navigate('/products/list');
    }
    else if (productUpdatedata.status === 400) {
      setFormErrors(productUpdatedata.error);
    }
    else {
      toast.error("Failed to update product.");
    }
  }, [productUpdatedata, navigate]);


  return (
    <AdminLayout>
      <div className="bhumi_putra_form">
        <div className="container">
          <div className="main-container">

            <div className="form-header">
              <h2>Product Management</h2>
              <p className="subtitle">Update Product</p>
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Is joining package?</label>
                        <div className="d-flex align-items-center mt-2">
                          <Checkbox
                            name="is_joining_package"
                            id="is_joining_package"
                            value={formData.is_joining_package}
                            onchangeFunction={handleChange}
                          />
                        </div>
                        <div className="hint-text">For Joining Package</div>
                      </div>
                    </div>

                  </div>
                </div>


                {/* Submit Button */}
                <div className="text-center mt-4">
                  <button type="submit" className="submit-btn">
                    Update Product
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
