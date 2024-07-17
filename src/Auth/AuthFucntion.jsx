import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function validateUser(userData) {
  let BaseUrl = "https://localhost:7122/api/Authentication/Login/";
  return new Promise((resolve, reject) => {
    fetch(BaseUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(errorJson => { // Đổi tên biến thành errorJson
            // Giả sử API trả về lỗi trong errorJson.errorMessages
            throw new Error(errorJson.errorMessages); 
          }); 
        }
        return response.json();
      })
      .then((responseJson) => {
        localStorage.setItem("token", responseJson.token);
        resolve();
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập:", error.message); 
        reject(error);
      });
  });
}

export function LogoutAndRedirect() {
  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const tokenExpirationTime = 1000;
      const timeoutId = setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
        window.alert("Session time out");
      }, tokenExpirationTime);

      return () => clearTimeout(timeoutId);
    }
  }, []);
}

export function LogoutByButton() {
  localStorage.removeItem("token");
}