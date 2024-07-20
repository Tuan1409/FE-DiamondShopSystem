import './navBar.css';
import { Link, useMatch, useResolvedPath, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null; // Kiểm tra token trước
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7122/api/Category/GetCategories');
        const flatCategories = flattenCategories(response.data.data);
        const uniqueCategories = Array.from(new Set(flatCategories.map(a => a.name)))
          .map(name => {
            return flatCategories.find(a => a.name === name)
          })
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách category:", error);
      }
    };
    fetchCategories();
  }, []);

  const flattenCategories = (categories) => {
    let flatCategories = [];
    categories.forEach(category => {
      flatCategories.push({ id: category.id, name: category.name });
      if (category.children && category.children.length > 0) {
        flatCategories = flatCategories.concat(flattenCategories(category.children));
      }
    });
    return flatCategories;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('profile');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid" id="navBarContainer">
        <Link to="/" className="navbar-brand">Trang chủ </Link> 

          {/* Hiển thị danh sách category */}
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="nav-link"
            >
              {category.name}
            </Link>
          ))}

          {/* Các phần tử còn lại của navbar */}
          <CustomLink to="/vieworder">Order </CustomLink>
          <CustomLink to="/cart">
            <img src="src\assets\img\shopping-cart (1).png" alt="" className="cartLogo" />
          </CustomLink>
          {isLoggedIn ? (
            <div>
              <img
                src="src\assets\img\avt.jpg"
                alt="Avatar"
                className="avatar-icon"
                onClick={handleProfile}
              />
         <span className="navbar-text mx-2" style={{ color: 'white' }}> 
  Welcome, {decodedToken?.Username}!
</span>
              <CustomLink to="/" onClick={handleLogout}>
                Logout
              </CustomLink>
            </div>
          ) : (
            <CustomLink to="/login">Login</CustomLink>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <div>
      <Link to={to} {...props} className={`nav-link ${isActive ? 'active' : ''}`}>
        {children}
      </Link>
    </div>
  );
}