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
import { ProductUpdate } from "./Modules/ProductManagement/ProductUpdate";
import { ProductAdd } from "./Modules/ProductManagement/ProductAdd";
import { ViewTeam } from "./Modules/User Management/ViewTeam";
import { ContactSubmissionList } from "./Modules/ContactFormSubmission/ContactSubmissionList";

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
        <Route path="products/add" element={<ProductAdd />} />
        <Route path="products/update/:product_id" element={<ProductUpdate />} />

        {/* team view */}
        <Route path="team/view" element={<ViewTeam />} />

        {/* contact forms submission */}
        <Route path="contact-submissions" element={<ContactSubmissionList />} />

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
