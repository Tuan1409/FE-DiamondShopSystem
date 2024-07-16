
import './navBar.css';

import { Link, useMatch, useResolvedPath, Outlet ,useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token') !== null; // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa token khi logout
        navigate('/login'); // Chuyển hướng về trang login
    };
    const handleProfile = () => {
        navigate('profile'); 
      };
    
    return (
        <>
            <nav className='navbar-expand-lg bg-body-tertiary '>
                <div className='container-fluid' id='navBarContainer'>
                    <div>
                        <Link to="/" >
                            Home
                        </Link>
                    </div>
                    <CustomLink to="/diamondPage/">Diamond</CustomLink>
                    <CustomLink to="/ring">Engagement Rings</CustomLink>
                    <CustomLink to="/">Wedding Rings</CustomLink>
                    <CustomLink to="/">Jewelry</CustomLink>
                    <CustomLink to="/">Gifts</CustomLink>
                    <CustomLink to="/">Gemstones</CustomLink>
                    <CustomLink to="/vieworder">Order</CustomLink>
                    <CustomLink to="/cart"><img src="src\assets\img\shopping-cart (1).png" alt="" className='cartLogo' /></CustomLink>
                    {isLoggedIn ? (
                         <div>
                         <img 
                src="src\assets\img\avt.jpg" 
                alt="Avatar" 
                className="avatar-icon" 
                onClick={handleProfile} 
              /> 
                         <CustomLink to="/" onClick={handleLogout}>Logout</CustomLink> 
                       </div>
                       
                    ) : (
                        <CustomLink to="/login">Login</CustomLink>
                    )}

                </div>
            </nav >
            <Outlet />
        </>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <div>
            <Link to={to} {...props} className={isActive ? "active" : ""}>
                {children}
            </Link>
        </div >
    )
}