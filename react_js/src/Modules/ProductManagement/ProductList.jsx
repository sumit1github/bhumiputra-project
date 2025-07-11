import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
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
      <div className="bhumi_putra_dashboard">
        <div className="main-content" id="mainContent">
          {/* Top Bar */}
          <div className="top-bar glass-effect fade-in-up">
            <h2 className="page-title">All product List</h2>
            <button className="btn btn-mars"
              onClick={() => navigate("/products/add")}
            >
              <FaPlus className="me-2" />
              Add Product
            </button>
          </div>
          {/* Search Section */}
          {/* <div className="search-section glass-effect fade-in-up">
            <div className="row align-items-center">
              <div className="col-md-3 col-sm-2">
                <select className="form-select search-input">
                  <option value="">ID</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div className="col-md-6 col-sm-6">
                <input type="text" className="form-control search-input" placeholder="Full Name, Email or Contact" />
              </div>
              <div className="col-md-3 col-sm-3">
                <button className="btn btn-mars w-100">
                  <FaSearch className="me-2" />
                  Search
                </button>
              </div>
            </div>
          </div> */}
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
                  <div className="action-buttons">
                    <button onClick={() => navigate(`/products/update/${data.id}`)} className="btn-action btn-edit">
                      <FaEdit />
                    </button>
                    <button className="btn-action btn-delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </TableLayout>
          <CustomPagination
            metadata={paginationMeta}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
};
