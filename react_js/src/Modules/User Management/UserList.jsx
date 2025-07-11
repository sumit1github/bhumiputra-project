import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
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
      <div className="bhumi_putra_dashboard">
        <div className="main-content" id="mainContent">
          {/* Top Bar */}
          <div className="top-bar glass-effect fade-in-up">
            <h2 className="page-title">All User List</h2>
            <button className="btn btn-mars"
              onClick={() => navigate("/users/add")}
            >
              <FaPlus className="me-2" />
              Add User
            </button>
          </div>

          {/* Search Section */}
          <div className="search-section glass-effect fade-in-up">
            <div className="row align-items-center">
              <div className="col-md-3 col-sm-2 col-3">
                <select className="form-select search-input" name="search_by" onChange={(e) => handleChange(e)}>
                  <option value="id">ID</option>
                  <option value="full_name">Full Name</option>
                  <option value="email">Email</option>
                  <option value="contact1">Contact</option>
                  <option value="all">NO-Filter</option>
                </select>
              </div>
              <div className="col-md-6 col-sm-2 col-5">
                <input
                  type="text"
                  placeholder="Full Name, Email or Contact"
                  value={searchTerm.query || ""}
                  onChange={(e) => handleChange(e)}
                  name="query"
                  autoComplete="off"
                  className="form-control search-input"
                  title="Search by Full Name, Email or Contact"
                />
              </div>
              <div className="col-md-3 col-sm-1 col-2">
                <button className="btn btn-mars w-100" onClick={handleSearch}>
                  <FaSearch className="me-2" />

                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}

          <TableLayout
            is_loading={isLoading}
            columns={["ID", "Full Name", "Email", "contact1", "J-Level", "A-Level", "wallet_balance", "Actions"]}
            data={data}
            is_error={isError}
            error={error}
          >
            {userLIst.map((user) => (
              <tr key={user.id}>
                <td className="id-column">{user.id}</td>
                <td className="name-column">{user.full_name}</td>
                <td className="email-column">{user.email}</td>
                <td className="contact-column">{user.contact1}</td>
                <td><span className="level-badge">{user.joining_level}</span></td>
                <td><span className="level-badge">{user.achiver_level}</span></td>
                <td><span className="balance-amount">{user.wallet_balance}</span></td>

                <td>
                  <div className="action-buttons">
                    <button onClick={() => navigate(`/users/update/${user.id}`)} className="btn-action btn-edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => navigate(`/users/add?parent=${user.id}&name=${user.full_name}`)} className="btn-action btn-delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </TableLayout>

          {/* Pagination */}
          <CustomPagination
            metadata={paginationMeta}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserList;