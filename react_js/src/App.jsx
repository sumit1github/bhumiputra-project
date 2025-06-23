import "./App.css";
import Sidebar from "./common_components/sidebar/Sidebar";
import Header from "./common_components/header/Header";
import { IoMdNotifications } from "react-icons/io";
import { Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "./Modules/Auth/login/Login";
import { Route, Routes } from "react-router";
import Register from "./Modules/Auth/register/Register";
import Dashboard from "./Modules/IT-Dashboard/Dashboard";
function App() {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
