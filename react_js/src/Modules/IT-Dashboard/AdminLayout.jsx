import { useState } from "react";
import { CgClose, CgProfile } from "react-icons/cg";
import { FaRegEdit } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from 'react-router';

import {
  MdDashboard,
  MdExitToApp,
  MdMenu,
} from "react-icons/md";

import { IoMdNotifications } from "react-icons/io";

import "./AdminLayout.css";
import { useSelector } from 'react-redux';



const AdminLayout = ({ children }) => {

  const userData = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="main-layout">
      <div
        className={`sidebar-absolute-wrapper border   ${sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
      >
        <div
          className="sidebar-toggle-button border "
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <CgClose size={24} /> : <MdMenu size={24} />}
        </div>

        <div className="d-flex flex-column flex-shrink-0 p-3 sidebar-container bg-light ">
          <span className="fs-4 text-center">Bhumi Putra</span>

          <div>
            <div className="d-flex flex-column align-items-center p-3 w-100 justify-content-center ">
              <img
                src="/dashboard/person.avif"
                alt="Profile_pic"
                className="person-image-2 border"
              />
              <div>
                <div className="text-muted text-center">{userData?.user?.full_name}</div>
                <div className="text-muted text-sm ">{userData?.user?.email}</div>
              </div>
              <div className="d-flex gap-4 align-items-center p-3">
                <CgProfile size={24} title="Profile" />
                <FaRegEdit size={24} title="Edit Profile" />
                <MdExitToApp size={26} title="Logout" />
              </div>
              <hr className="border-b" />
              <ul className="nav nav-pills  flex-column mb-auto">

                {/* Dash-board */}
                <li className="nav-item">
                  <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated`}>
                    <div className="d-flex align-items-center pointer gap-4 flex-grow-1" >
                      <MdDashboard />
                      <Link to={"/dashboard"} className="text-decoration-none text-dark">
                        <span>Dashboard</span>
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Users */}
                <li className="nav-item">
                  <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated`}>
                    <div className="d-flex align-items-center pointer gap-4 flex-grow-1" >
                      <MdDashboard />
                      <Link to={"/users"} className="text-decoration-none text-dark">
                        <span>User Management</span>
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Products */}
                <li className="nav-item">
                  <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated`}>
                    <div className="d-flex align-items-center pointer gap-4 flex-grow-1" >
                      <MdDashboard />
                      <Link to={"/products/list"} className="text-decoration-none text-dark">
                        <span>Products</span>
                      </Link>
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
        <div className="border header d-flex align-items-center  justify-content-end ">

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
          className="page-scroll-content dashboard-container"
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
