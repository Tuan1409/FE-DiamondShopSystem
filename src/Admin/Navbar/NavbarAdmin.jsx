import React, { useState, useEffect } from 'react';
import { Link, useMatch, useResolvedPath, Outlet } from 'react-router-dom';
import './NavbarAdmin.css';
import { LogoutByButton } from '../../Auth/AuthFucntion';

import { jwtDecode } from "jwt-decode"; 
export default function NavbarAdmin() {
    const [hidden, setHidden] = useState(false);
    const [userRole, setUserRole] = useState(null); 

    useEffect(() => {
        // Get and decode the token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role); 
            } catch (error) {
                console.error("Error decoding token:", error); 
            }
        }
    }, []); 

    function hoverTheList() {
        setHidden(true);
    }

    function unhoverTheList() {
        setHidden(false);
    }

    return (
        <div>
            <nav className='adminNavContainer '>
                <ul className='container-fluid' id='navbarAdminContainer'>
                    <CustomLink to="/">Home</CustomLink>

                    {userRole === 'Admin' && (
                        <>
                            <CustomLink to="account">Account</CustomLink>
                            <CustomLink to="promotion">Promotion</CustomLink>
                        </>
                    )}
                    {userRole === 'SaleStaff' && (
                        <>
                            <CustomLink to="category">Category</CustomLink>
                            <CustomLink to="productype">Productype</CustomLink>
                            <CustomLink to="diamond">Diamond</CustomLink>
                            <CustomLink to="product">Product</CustomLink>
                            <CustomLink to="order">Order</CustomLink>
                        </>
                    )}

                    <CustomLink to='/'>
                        <button onClick={LogoutByButton} className='btn btn-danger btn-block'>
                            Log out
                        </button>
                    </CustomLink>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className='listNavAdmin'>
            <Link to={to} {...props} className={isActive ? "active" : ""}>
                {children}
            </Link>
        </li>
    );
}