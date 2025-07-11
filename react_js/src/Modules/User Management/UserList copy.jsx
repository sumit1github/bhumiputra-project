import React, { useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Card,
} from "react-bootstrap";
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import {
  BiPlusCircle,
  BiSearch,
} from "react-icons/bi";
import { useNavigate } from "react-router";

import { getUserList, UserSearchApiCall } from "./auth_calls";
import { TableLayout } from "../../common_components/Table/Table";
import CustomPagination from "../../common_components/pagination/CustomPagination";

import "./UserList.css";
import AdminLayout from "../IT-Dashboard/AdminLayout";

const UserList = () => {
  const navigate = useNavigate();
  const [userLIst, setUserLIst] = useState([]);
  const [reload_page, setReloadPage] = useState(0); // State to trigger reload of user list


  //----------------------------- pagination ----------------------------------
  const [paginationMeta, setPaginationMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const { mutate: loadUserList, isLoading, isError, error, data } = getUserList();

  // Load user list when component mounts or when page changes
  React.useEffect(() => {
    loadUserList(currentPage);
  }, [currentPage, reload_page]);

  React.useEffect(() => {
    if (data) {
      setUserLIst(data.user_list || []);
      if (data.pagination_meta_data) {
        setPaginationMeta(data.pagination_meta_data);
      }
    }
  }, [data]);


  // ------------------for user search-------------------
  const {
    mutate: UserSearchAPI,
    data: UserSearchdata,
    isLoading: UserSearchisLoading,
    isError: UserSearchisError,
    error: UserSearcherror
  } = UserSearchApiCall();

  const [searchTerm, setSearchTerm] = useState({
    "search_by": "id",
    "query": null

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm({
      ...searchTerm,
      [name]: value
    });
    if (value === "all") {
      setReloadPage(prev => prev + 1);
      setSearchTerm({
        ...searchTerm,
        query: null
      });
    }
  };

  const handleSearch = () => {
    ``
    if (searchTerm.query) {
      UserSearchAPI({
        search_by: searchTerm.search_by,
        query: searchTerm.query
      });
    }
  };

  React.useEffect(() => {
    if (UserSearchdata) {
      setUserLIst(UserSearchdata.user_list || []);
      if (UserSearchdata.pagination_meta_data) {
        setPaginationMeta(UserSearchdata.pagination_meta_data);
      }
    }
  }, [UserSearchdata]);

  return (
    <AdminLayout>
      <div className="userLIst-container">
        <Container fluid>
          <h3 className="p-2 pl-0">All User List</h3>

          <Card className="controls-card mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={8} md={12}>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <Form.Select
                      style={{ width: '150px' }}
                      name="search_by"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="id">ID</option>
                      <option value="full_name">Full Name</option>
                      <option value="email">Email</option>
                      <option value="contact1">Contact</option>
                      <option value="all">NO-Filter</option>
                    </Form.Select>

                    <InputGroup className="search-input">
                      <InputGroup.Text>
                        <BiSearch size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Full Name, Email or Contact"
                        value={searchTerm.query || ""}
                        onChange={(e) => handleChange(e)}
                        name="query"
                        autoComplete="off"
                        className="search-input-field"
                        title="Search by Full Name, Email or Contact"
                      />
                      <Button
                        variant="primary"
                        onClick={handleSearch}
                      >
                        Search
                      </Button>
                    </InputGroup>
                  </div>
                </Col>

                <Col lg={4} md={12}>
                  <div className="d-flex justify-content-end gap-2 flex-wrap">

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate("/users/add")}
                      className="action-btn btn-outline-success"
                      title="Add New User"
                      style={{ width: "150px" }}
                    >
                      Add User
                      <BiPlusCircle size={16} />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Table Card */}
          <Card className="table-card">
            <Card.Body className="p-2">
              <div className="table-responsive">
                <TableLayout
                  is_loading={isLoading}
                  columns={["ID", "Full Name", "Email", "contact1", "J-Level", "A-Level", "wallet_balance", "Actions"]}
                  data={data}
                  is_error={isError}
                  error={error}
                >
                  {userLIst.map((data) =>
                    <tr key={data.id}>
                      <td>{data.id}</td>
                      <td>{data.full_name}</td>
                      <td>{data.email}</td>
                      <td>{data.contact1}</td>
                      <td>{data.joining_level}</td>
                      <td>{data.achiver_level}</td>
                      <td>{data.wallet_balance}</td>
                      <td>
                        <FaEdit onClick={() => navigate(`/users/update/${data.id}`)} style={{ color: "#0e0eee" }} />
                        <IoMdPersonAdd title="Add User" onClick={() => navigate(`/users/add?parent=${data.id}&name=${data.full_name}`)} style={{ color: "green" }} />
                      </td>
                    </tr>
                  )}
                </TableLayout>

                {/* pagination */}

                <CustomPagination
                  metadata={paginationMeta}
                  onPageChange={handlePageChange}
                />
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>

      <div className="main-content" id="mainContent">
        {/* Top Bar */}
        <div className="top-bar glass-effect fade-in-up">
          <h2 className="page-title">All User List</h2>
          <button className="btn btn-mars">
            <FaPlus className="me-2" />
            Add User
          </button>
        </div>

        {/* Search Section */}
        <div className="search-section glass-effect fade-in-up">
          <div className="row align-items-center">
            <div className="col-md-3">
              <select className="form-select search-input">
                <option value="">ID</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control search-input" placeholder="Full Name, Email or Contact" />
            </div>
            <div className="col-md-3">
              <button className="btn btn-mars w-100">
                <FaSearch className="me-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table fade-in-up">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>J-Level</th>
                  <th>A-Level</th>
                  <th>Wallet Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 23,
                    name: "ccc axcsdv",
                    email: "admin13434341@gmail.com",
                    contact: "zxcacdvxcf",
                    jLevel: 4,
                    aLevel: "-",
                    balance: "$0.00"
                  },
                  {
                    id: 22,
                    name: "ccc axcsdv",
                    email: "admin1343341@gmail.com",
                    contact: "zxcacdv",
                    jLevel: 4,
                    aLevel: "-",
                    balance: "$0.00"
                  },
                  {
                    id: 21,
                    name: "sumit panda",
                    email: "admin1@gmail.com",
                    contact: "22344",
                    jLevel: 4,
                    aLevel: "-",
                    balance: "$0.00"
                  },
                  {
                    id: 20,
                    name: "level344",
                    email: "lala@gmail.com",
                    contact: "6362",
                    jLevel: 3,
                    aLevel: "-",
                    balance: "$50.00"
                  },
                  {
                    id: 19,
                    name: "level3",
                    email: "level3@gmail.com",
                    contact: "1236",
                    jLevel: 2,
                    aLevel: "-",
                    balance: "$55.00"
                  },
                  {
                    id: 18,
                    name: "level1",
                    email: "l1@gmail.com",
                    contact: "1",
                    jLevel: 1,
                    aLevel: 1,
                    balance: "$50.00"
                  },
                  {
                    id: 17,
                    name: "admin dada",
                    email: "admin@gmail.com",
                    contact: "8617811488",
                    jLevel: 0,
                    aLevel: "-",
                    balance: "$24.00"
                  },
                ].map((user) => (
                  <tr key={user.id}>
                    <td className="id-column">{user.id}</td>
                    <td className="name-column">{user.name}</td>
                    <td className="email-column">{user.email}</td>
                    <td className="contact-column">{user.contact}</td>
                    <td><span className="level-badge">{user.jLevel}</span></td>
                    <td><span className="level-badge">{user.aLevel}</span></td>
                    <td><span className="balance-amount">{user.balance}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-edit">
                          <FaEdit />
                        </button>
                        <button className="btn-action btn-delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">3</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </AdminLayout>
  );
};

export default UserList;