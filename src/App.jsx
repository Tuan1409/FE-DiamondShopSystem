import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Homepage from "./Pages/Homepage";
import DiamondPage from "./Pages/DiamondPages";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Admin from "./Admin/Admin";
import Category from "./Admin/Elements/Category/Category";
import Account from "./Admin/Elements/Account/Account";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Homepage />} />
          <Route path="diamondPage" element={<DiamondPage />} />
          <Route path="product" element={<Ring />} />
        </Route>

        <Route path="/diamond-detail/:id" element={<DiamondDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="category" element={<Category />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}