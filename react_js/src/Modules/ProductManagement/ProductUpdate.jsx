import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams } from "react-router";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router";


import AdminLayout from "../IT-Dashboard/AdminLayout";
import { productUpdate, productDetailsApiCall } from "./product_calls";

export const ProductUpdate = () => {
  const [formErrors, setFormErrors] = useState({});
  const { product_id } = useParams();
  const navigate = useNavigate();

  console.group("Product Update Component");
  console.log("Product ID:", formErrors);
  console.groupEnd();


  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    brand: '',
    buy_price: 0,
    sell_price: 0,
    stock: 1,
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
      }));
    }
  }, [product_detaildata]);

  //  -------------- product update -----------------


  const {
    mutate: updateProduct,
    data: productUpdatedata
  } = productUpdate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      <div className="container-fluid">
        <Card style={{ width: '36%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }}>
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Update Product</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>UID</Form.Label>
                <Form.Control type="text" name="uid" value={formData.uid} onChange={handleInputChange} />
                {formErrors.uid && <div className="text-danger">{formErrors.uid}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
                {formErrors.brand && <div className="text-danger">{formErrors.brand}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Buy Price</Form.Label>
                <Form.Control type="number" name="buy_price" value={formData.buy_price} onChange={handleInputChange} />
                {formErrors.buy_price && <div className="text-danger">{formErrors.buy_price}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sell Price</Form.Label>
                <Form.Control type="number" name="sell_price" value={formData.sell_price} onChange={handleInputChange} />
                {formErrors.sell_price && <div className="text-danger">{formErrors.sell_price}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} />
                {formErrors.stock && <div className="text-danger">{formErrors.stock}</div>}
              </Form.Group>

              <div className='row'>
                <div className='col-md-8'>
                  <Button variant="primary" type="submit" className="w-100">
                    Update Product
                  </Button>
                </div>

                <div className='col-md-4'>
                  <Button variant="danger" type="button" style={{ float: 'right' }} onClick={() => navigate('/products/list')}>
                    <RxCross2 /> Cancel
                  </Button>
                </div>

              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout >
  );
};
