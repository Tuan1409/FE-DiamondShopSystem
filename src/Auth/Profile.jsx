import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import "./Login.css";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        console.log(decodedToken.Id);
        const userId = decodedToken.Id; // Lấy ID người dùng từ decodedToken
        const response = await axios.get(`https://localhost:7122/api/Account/GetAccountById/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data);
        setIsLoading(false);
        console.log(response.data.data)
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error.message}</div>;
  }

  return (
    <div className="pageLoginContainer profile-container"> 
    <div className="profile-container">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Thông tin cá nhân</h2>

      <div className="profile-section">
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>Email: {user.email}</p>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>Tên: {user.name}</p>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>Giới tính: {user.gender}</p>
      </div>

      <div className="profile-section">
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>Số điện thoại: {user.phoneNumber}</p>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>Điểm tích lũy: {user.point}</p>
      </div>
    </div>
    </div>
  );
};

export default Profile;