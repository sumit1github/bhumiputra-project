import "./App.css";

import Login from "./Modules/Auth/login/Login";
import Register from "./Modules/Auth/register/Register";

import { Route, Routes } from "react-router";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserList from "./Modules/User Management/UserList";
import UserAdd from "./Modules/User Management/UserAdd";
import UserUpdate from "./Modules/User Management/UserUpdate";
import { ProductList } from "./Modules/ProductManagement/ProductList";

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
      
        {/* user management */}
        <Route path="users" element={<UserList />} />
        <Route path="users/add" element={<UserAdd />} />
        <Route path="users/update/:user_id" element={<UserUpdate />} />

        {/* user management */}
        <Route path="products/list" element={<ProductList />} />
        

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
