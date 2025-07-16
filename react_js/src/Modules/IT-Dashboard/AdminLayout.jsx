import { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { FaBox, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { IoMdRefresh, IoMdWallet } from "react-icons/io";
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';


import {
  MdExitToApp,
  MdMenu,
} from "react-icons/md";

import "./AdminLayout.css";
import { logOut } from "../Auth/auth_calls";
import { SquareButton89 } from "../../common_components/buttons/SquareButton89";
import { UserDetailsApiCall } from "../User Management/auth_calls";
import { loginSuccess } from "../../store/Slices/Room/UserSlice";


const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
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

  // // Logout function
  const {
    mutate: logout,
  } = logOut();


  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    navigate("/login");
  };


  // -------------Loading User Details from API----------------
  const {
    mutate: loadUserDetails,
    data: user_detaildata,
    isLoading: user_detailisLoading,
    isError: user_detailisError,
    error: user_detailerror
  } = UserDetailsApiCall();

  const refreshUserDetails = () => {
    if (userData?.user?.id) {
      loadUserDetails(userData?.user?.id, {
        onSuccess: (data) => {
          console.log("User details loaded successfully:", data);
          dispatch(loginSuccess(data.user)); // Update Redux state
        },
        onError: (error) => {
          console.error("Error loading user details:", error);
        },
      });
    } else {
      console.error("User ID is null, cannot refresh user details.");
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
              <img src="/logo.png" alt="Profile_pic" className="person-image-2 border" />
              <div>
                <div className="text-white text-center">{userData?.user?.id_prefix}{userData?.user?.id}</div>
                <div className="text-white text-sm text-center">{userData?.user?.full_name}</div>
                <div className="text-white text-sm ">{userData?.user?.email}</div>
              </div>
              <div className="d-flex gap-4 align-items-center p-3">
                {!userData?.user?.roles?.includes('ADMIN') && (
                  <>
                    <div className="d-flex align-items-center gap-2">
                      <IoMdWallet size={24} title="Profile" style={{ color: "aliceblue" }} />
                      <span className="text-white small">₹{userData?.user?.wallet_balance || '0.00'}</span>
                    </div>
                    <IoMdRefresh size={24} title="Refresh Profile" style={{ color: "aliceblue" }} onClick={refreshUserDetails} />
                  </>
                )}
                <MdExitToApp size={26} title="Logout" onClick={handleLogout} style={{ color: "aliceblue" }} />
              </div>

              {!userData?.user?.roles?.includes('ADMIN') && (
                <p><SquareButton89 label={`JOIN-PINS: ${userData?.user?.invite_tokens}`} /></p>
              )}

              <hr className="border-b" />
              <ul className="nav side_nav nav-pills  flex-column mb-auto">

                {/* Dash-board */}
                {/* <li className="nav-item">
                  <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated`}>
                    <div className="d-flex align-items-center pointer gap-4 flex-grow-1">
                      <FaTachometerAlt className="text-white" />
                      <span onClick={() => handleNavigation('/dashboard')}>Dashboard</span>
                    </div>
                  </div>
                </li> */}

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

                {(
                  userData?.user?.roles?.includes('ADMIN') ||
                  userData?.user?.roles?.includes('IT')
                ) && (
                    <li className="nav-item">
                      <div className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated ${window.location.pathname.startsWith('/products') ? 'nav-link active' : ''}`}>
                        <div className="d-flex align-items-center pointer gap-4 flex-grow-1" >
                          <FaBox className="text-white" />
                          <span
                            onClick={() => handleNavigation('/products/list')}
                            className="text-decoration-none text-white"
                          >
                            Products
                          </span>
                        </div>
                      </div>
                    </li>
                  )}

              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`main-content ${sidebarOpen ? "with-sidebar" : ""}`}
        style={{
          marginLeft: sidebarOpen ? '280px' : '0px',
          transition: 'margin-left 0.3s ease',
          width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="border header d-flex align-items-center justify-content-between px-3" style={{ flexShrink: 0 }}>
          <img src="/logo.png" alt="Logo" className="person-image-3" />

          {/* Progress Bar Section */}
          {!userData?.user?.roles?.includes('ADMIN') && (
            <div className="d-flex align-items-center gap-3 ms-auto pe-3">
              <div className="d-flex align-items-center gap-2">
                <span className="level-progress-label">Level</span>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${((userData?.user?.achiver_level || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {userData?.user?.achiver_level || 0}/5
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
        <div
          className="dashboard-container"
          style={{ flex: 1, overflow: 'auto' }}
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
