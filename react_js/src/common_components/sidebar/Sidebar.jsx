import { useState } from "react";
import { CgClose, CgProfile } from "react-icons/cg";
import { FaRegEdit } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import Dropdown from "react-bootstrap/Dropdown";

import {
  MdAccountCircle,
  MdAppShortcut,
  MdBarChart,
  MdCalendarToday,
  MdDashboard,
  MdEmail,
  MdExitToApp,
  MdInsertChart,
  MdLayers,
  MdLogout,
  MdMeetingRoom,
  MdMenu,
  MdOutlineDomainAdd,
  MdOutlineFormatAlignCenter,
  MdOutlineHolidayVillage,
  MdOutlineKey,
  MdOutlineKeyOff,
  MdOutlineLocalTaxi,
  MdOutlinePeopleOutline,
  MdOutlinePermContactCalendar,
  MdOutlineWarehouse,
  MdSupportAgent,
  MdTableChart,
  MdTask,
  MdWidgets,
  MdExpandMore,
  MdExpandLess,
  MdAllInbox,
  MdStackedBarChart,
} from "react-icons/md";
import { TiBackspace } from "react-icons/ti";
import { IoMdNotifications } from "react-icons/io";
import { AiFillBackward } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";

import "./Sidebar.css";

const sidebarItems = [
  { label: "Dashboard", icon: <MdDashboard /> },
  { label: "Occupancy", icon: <MdOutlineWarehouse /> },
  {
    label: "Bookings",
    icon: <MdOutlineKey />,
    subItems: [
      { label: "All Booking", icon: <MdStackedBarChart /> },
      { label: "Add Booking", icon: <BsPlus /> },
      { label: "Cancel Booking", icon: <MdOutlineKeyOff /> },
    ],
  },
  {
    label: "Rooms",
    icon: <MdMeetingRoom />,
    subItems: [
      { label: "All rooms", icon: <MdStackedBarChart /> },
      { label: "Add Room", icon: <MdOutlineDomainAdd /> },
      { label: "Edit Room", icon: <MdOutlineKeyOff /> },
    ],
  },
  { label: "Staffs", icon: <MdOutlinePeopleOutline /> },
  { label: "Departments", icon: <MdOutlineDomainAdd /> },
  { label: "Housekeeping", icon: <MdOutlineHolidayVillage /> },
  { label: "Leave Management", icon: <MdOutlineHolidayVillage /> },
  { label: "Cabs", icon: <MdOutlineLocalTaxi /> },
  { label: "Reports", icon: <MdInsertChart /> },
  { label: "App", icon: <MdAppShortcut /> },
  { label: "Calendar", icon: <MdCalendarToday /> },
  { label: "Task", icon: <MdTask /> },
  { label: "Contacts", icon: <MdOutlinePermContactCalendar /> },
  { label: "Chat", icon: <TiBackspace /> },
  { label: "Email", icon: <MdEmail /> },
  { label: "Support", icon: <MdSupportAgent /> },
  { label: "Material", icon: <MdWidgets /> },
  { label: "Permissions", icon: <MdOutlineKeyOff /> },
  { label: "Forms", icon: <MdOutlineFormatAlignCenter /> },
  { label: "Tables", icon: <MdTableChart /> },
  { label: "Charts", icon: <MdBarChart /> },
  { label: "Widgets", icon: <MdWidgets /> },
  { label: "Profile", icon: <MdAccountCircle /> },
  { label: "Sessions", icon: <MdLogout /> },
  { label: "Utilities", icon: <MdLayers /> },
  { label: "Menu Level", icon: <MdMenu /> },
];

const Sidebar = ({ children, setSelectedSection, selected }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (itemLabel) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  return (
    <div className="main-layout">
      <div
        className={`sidebar-absolute-wrapper border   ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div
          className="sidebar-toggle-button border "
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <CgClose size={24} /> : <MdMenu size={24} />}
        </div>

        <div className="d-flex flex-column flex-shrink-0 p-3 sidebar-container bg-light ">
          <span className="fs-4 text-center">SuiteSync</span>

          <div>
            <div className="d-flex flex-column align-items-center p-3 w-100 justify-content-center ">
              <img
                src="/dashboard/person.avif"
                alt="Profile_pic"
                className="person-image-2 border"
              />
              <div>
                <div className="text-muted text-center">Admin</div>
                <div className="text-muted text-sm ">test@example.com</div>
              </div>
              <div className="d-flex gap-4 align-items-center p-3">
                <CgProfile size={24} />
                <FaRegEdit size={24} />
                <SiTicktick size={24} />
                <MdExitToApp size={26} />
              </div>
              <hr className="border-b" />
              <ul className="nav nav-pills  flex-column mb-auto">
                {sidebarItems.map((item, index) => (
                  <li key={index} className="nav-item">
                    <div
                      className={`d-flex m-1 align-items-center justify-content-between sidebar-padding sidebar-item-animated ${
                        selected == item.label.toLocaleLowerCase()
                          ? "sidebar-selected"
                          : " sidebar-item"
                      }`}
                    >
                      <div
                        className="d-flex align-items-center pointer gap-4 flex-grow-1"
                        onClick={() => {
                          toggleExpanded(item.label);
                          if (!item.subItems) {
                            setSelectedSection(item.label.toLowerCase());
                          }
                        }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.subItems && (
                        <div
                          className={`expand-arrow ${
                            expandedItems[item.label] ? "rotated" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(item.label);
                          }}
                        >
                          <MdExpandMore size={20} />
                        </div>
                      )}
                    </div>
                    {item.subItems && (
                      <div
                        className={`sidebar-subitems-container ${
                          expandedItems[item.label] ? "expanded" : "collapsed"
                        }`}
                      >
                        <ul className="nav nav-pills flex-column sidebar-subitems">
                          {item.subItems.map((subItem, subIndex) => (
                            <li
                              key={subIndex}
                              className={`nav-item d-flex m-1 align-items-center gap-4 sidebar-padding sidebar-subitem-animated ${
                                selected == subItem.label.toLocaleLowerCase()
                                  ? "sidebar-selected"
                                  : " sidebar-item"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSection(subItem.label.toLowerCase());
                              }}
                            >
                              {subItem.icon}
                              <span>{subItem.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`main-content fixed-top ${
          sidebarOpen ? "with-sidebar" : ""
        }`}
      >
        <div className="border header d-flex align-items-center  justify-content-end ">
          <IoMdNotifications size={20} />

          <Dropdown>
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
          </Dropdown>
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

export default Sidebar;
