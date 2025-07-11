import { useState, useEffect } from "react";
import { CgClose, CgProfile } from "react-icons/cg";
import { FaBox, FaRegEdit, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from 'react-router';

import {
  MdExitToApp,
  MdMenu,
} from "react-icons/md";

import "./AdminLayout.css";
import { useSelector } from 'react-redux';



const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(
    localStorage.getItem("sidebarOpen") === "false" ? false : true
  );
  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  const handleNavigation = (path) => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
      setTimeout(() => {
        navigate(path);
      }, 300); // Delay navigation to ensure sidebar state is updated
    } else {
      navigate(path);
    }
  };

  return (
    <div className="main-layout">
      <div
        className={`sidebar-absolute-wrapper bhumi_putra_dashboard    ${sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
      >
        <div
          className="sidebar-toggle-button border "
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <CgClose size={24} /> : <MdMenu size={24} />}
        </div>

        <div className="d-flex flex-column flex-shrink-0 p-3 sidebar-container">
          {/* <span className="fs-4 text-center">Bhumi Putra</span> */}

          <div>
            <div className="d-flex flex-column align-items-center p-0 w-100 justify-content-center ">
              <img
                src="/logo.png"
                alt="Profile_pic"
                className="person-image-2 border"
              />
              <div>
                <div className="text-white text-center">{userData?.user?.full_name}</div>
                <div className="text-white text-sm ">{userData?.user?.email}</div>
              </div>
              <div className="d-flex gap-4 align-items-center p-3">
                <CgProfile size={24} title="Profile" />
                <FaRegEdit size={24} title="Edit Profile" />
                <MdExitToApp size={26} title="Logout" />
              </div>
              <hr className="border-b" />
              <ul className="nav side_nav nav-pills  flex-column mb-auto">

                {/* Dash-board */}
                <li className="nav-item">
                  <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated`}>
                    <div className="d-flex align-items-center pointer gap-4 flex-grow-1">
                      <FaTachometerAlt className="text-white" />
                      <span onClick={() => handleNavigation('/dashboard')}>Dashboard</span>
                    </div>
                  </div>
                </li>

                {/* Users */}
                <li className="nav-item">
                  <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated ${window.location.pathname.startsWith('/users') ? 'nav-link active' : ''}`}>
                    <div className='d-flex align-items-center pointer gap-4 flex-grow-1 ' >
                      <FaUsers className="text-white" />
                      <span onClick={() => handleNavigation('/users')} className="text-decoration-none text-white">User Management</span>
                    </div>
                  </div>
                </li>

                {/* Products */}
                <li className="nav-item">
                  <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated ${window.location.pathname.startsWith('/products') ? 'nav-link active' : ''}`}>
                    <div className="d-flex align-items-center pointer gap-4 flex-grow-1" >
                      <FaBox className="text-white" />
                      <span onClick={() => handleNavigation('/products/list')} className="text-decoration-none text-white">Products</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`main-content fixed-top ${sidebarOpen ? "with-sidebar" : ""
          }`}
      >
        <div className="border header d-flex align-items-center  justify-content-center">

          <img src="/logo.png" alt="Logo" className="person-image-3" />
          {/* <Dropdown>
            <Dropdown.Toggle className="button" id="dropdown-basic">
              <img
                src={"/dashboard/person.avif"}
                className="person-image"
              ></img>
              Admin
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
              <Dropdown.Item href="#/action-2"> Action 2</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>{" "}
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4" href="/">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        </div>
        <div
          className="dashboard-container"
          onClick={() => {
            window.innerWidth < 776 && setSidebarOpen(false);
          }}
        >

          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
