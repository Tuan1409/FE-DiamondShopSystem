import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Homepage from "./Pages/Homepage";
import Ring from "./Pages/Ring";
import DiamondPage from "./Pages/DiamondPage";
import Cart from "./Components/Content/Category/Cart"; 
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Admin from "./Admin/Admin";
import Category from "./Admin/Elements/Category/Category";
import Account from "./Admin/Elements/Account/Account";
import Product from "./Admin/Elements/Product/Product";
import Order from "./Admin/Elements/Order/Order.jsx";
import Promotion from "./Admin/Elements/Promotion/Promotion.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}> {/* Bắt đầu component Home */}
          <Route index element={<Homepage />} />
          <Route path="diamondPage" element={<DiamondPage />} />
          <Route path="ring" element={<Ring />} />
          <Route path="cart" element={<Cart />} /> {/* Đặt route /cart ở đây */}
        </Route> {/* Kết thúc component Home */} 

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="category" element={<Category />} />
          <Route path="account" element={<Account />} />
          <Route path="product" element={<Product />} />
          <Route path="order" element={<Order />} />
          <Route path="promotion" element={<Promotion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}