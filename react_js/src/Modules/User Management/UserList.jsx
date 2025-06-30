import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Card,
} from "react-bootstrap";

import {
  BiPlusCircle,
  BiSearch,
} from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router";

import { getUserList } from "./auth_calls";
import {TableLayout} from "../../common_components/Table/Table";
import CustomPagination from "../../common_components/pagination/CustomPagination";

import "./UserList.css";
import AdminLayout from "../IT-Dashboard/AdminLayout";

const UserList = () => {
  const navigate = useNavigate();
  const [userLIst, setUserLIst] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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
  }, [currentPage]);

  React.useEffect(() => {
    if (data) {
      setUserLIst(data.user_list || []);
      if (data.pagination_meta_data) {
        setPaginationMeta(data.pagination_meta_data);
      }
    }
  }, [data]);


  return (
    <AdminLayout>
      <div className="userLIst-container">
        <Container fluid>
          <h3 className="p-2 pl-0">All User List</h3>
          {/* Controls Card */}
          <Card className="controls-card mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={6} md={12}>
                  <div className="d-flex align-items-center gap-3 flex-wrap ">
                    <InputGroup className="search-input">
                      <InputGroup.Text>
                        <BiSearch size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search userLIst..."
                      />
                    </InputGroup>
                  </div>
                </Col>

                <Col lg={6} md={12}>
                  <div className="d-flex justify-content-end gap-2 flex-wrap">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="action-btn"
                      title="Toggle Filters"
                    >
                      <FiFilter size={16} />
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate("/users/add")}
                      className="action-btn"
                      title="Add New User"
                    >
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
                  columns={["ID", "Full Name", "Email", "contact1", "J-Level","A-Level","wallet_balance", "Actions"]} 
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
                        <FaEdit onClick={()=>navigate(`/users/update/${data.id}`)}/>
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
    </AdminLayout>
  );
};

export default UserList;