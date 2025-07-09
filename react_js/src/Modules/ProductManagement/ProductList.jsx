import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router";


import { TableLayout } from "../../common_components/Table/Table";
import CustomPagination from "../../common_components/pagination/CustomPagination";
import AdminLayout from "../IT-Dashboard/AdminLayout";
import { getProductList, productCreate } from "./product_calls";

export const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProducts] = useState([]);
  const [reload_page, setReloadPage] = useState(0); // State to trigger reload of user list
  const [formErrors, setFormErrors] = useState({});

  // ------- pagination ----------------
  const [paginationMeta, setPaginationMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // ------------- load product list ----------------
  const {
    mutate: loadProductList,
    data: productData,
    isLoading: productIsLoading,
    isError: productIsError,
    error: productError
  } = getProductList();

  useEffect(() => {
    loadProductList(currentPage);
  }, [currentPage, reload_page]);

  useEffect(() => {
    if (productData) {
      setProducts(productData.product_list || []);

      if (productData.pagination_meta_data) {
        setPaginationMeta(productData.pagination_meta_data);
      }
    }
  }, [productData]);


  //  -------------- product create -----------------

  const {
    mutate: createProduct,
    data: ProductCreateData,
    isLoading: createIsLoading,
    isError: createIsError,
    error: createError,
  } = productCreate();

  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    brand: '',
    buy_price: 0,
    sell_price: 0,
    stock: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createProduct(formData, {
      onSuccess: (data) => {
        if (data?.status === 200) {
          setFormErrors({});
          toast.success("Product Added successfully!");
          setFormData({
            uid: '',
            name: '',
            brand: '',
            buy_price: 0,
            sell_price: 0,
            stock: 1
          });
          setReloadPage(prev => prev + 1);

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
        toast.error("Failed to Create Product.");
      },
    });

  };

  useEffect(() => {
    if (ProductCreateData) {
      setReloadPage(prev => prev + 1);
    }
  }, [ProductCreateData]);

  return (
    <AdminLayout>
      <div className="container-fluid">
        <Row className="h-100">
          <Col md={8} className="p-3">
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Product List</h5>
              </Card.Header>
              <Card.Body>
                <TableLayout columns={["PID", "Name", "Brand", "Buy Price", "Sell Price", "BV", "Stock", "Actions"]} >
                  {productList?.map((data) =>
                    <tr key={data.id}>
                      <td>{data.id}</td>
                      <td>{data.name}</td>
                      <td>{data.brand}</td>
                      <td>{data.buy_price}</td>
                      <td>{data.sell_price}</td>
                      <td>{data.bv_price}</td>
                      <td>{data.stock}</td>
                      <td>
                        <FaRegEdit onClick={() => navigate(`/products/update/${data.id}`)} title='Edit' />
                        <FaRegTrashAlt style={{ color: '#ff0000' }} title='Delete' />
                      </td>
                    </tr>
                  )}
                </TableLayout>
                <CustomPagination
                  metadata={paginationMeta}
                  onPageChange={handlePageChange}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="p-3">
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Add Product</h5>
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
                    <Form.Label>Offer Price</Form.Label>
                    <Form.Control type="number" name="offerPrice" value={formData.offerPrice} onChange={handleInputChange} />
                    {formErrors.offerPrice && <div className="text-danger">{formErrors.offerPrice}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} />
                    {formErrors.stock && <div className="text-danger">{formErrors.stock}</div>}
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Add New Product
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};
