// Components/Content/Category/Cart.jsx
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      if (!token) {
        console.error("Chưa đăng nhập!");
        return;
      }

      try {
        const res = await fetch('https://localhost:7122/api/Cart/view-cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(`Lỗi khi lấy dữ liệu giỏ hàng: ${res.status}`);
        }

        const data = await res.json();
        setCart(data.data);
      } catch (error) {
        console.error('Lỗi:', error);
        toast.error('Có lỗi xảy ra khi lấy dữ liệu giỏ hàng!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    };

    fetchCartData();
  }, [token]);

  const calculateTotalPrice = () => {
    return cart ? cart.items.reduce((total, item) => total + item.quantity * item.price, 0) : 0;
  };

  const handleDeleteItem = async (productId) => {
    if (!token) {
      console.error("Chưa đăng nhập!");
      return;
    }

    try {
      const productToDelete = cart.items.find(item => item.productId === productId);
      if (!productToDelete) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng!');
      }

      const requestBody = {
        items: [
          {
            productId: productId,
            quantity: productToDelete.quantity 
          }
        ]
      };

      const res = await fetch(`https://localhost:7122/api/Cart/remove-from-cart`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestBody) 
      });

      if (!res.ok) {
        throw new Error(`Lỗi khi xóa sản phẩm: ${res.status}`);
      }

      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.productId !== productId)
      }));

      toast.success('Xóa sản phẩm thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm!', {
        // ... (toast options)
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      console.error("Chưa đăng nhập!");
      return;
    }

    try {
      const res = await fetch('https://localhost:7122/api/Order/place-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json(); // Lấy dữ liệu lỗi từ server (nếu có)
        const errorMessage = errorData.message || `Lỗi khi đặt hàng: ${res.status}`;
        throw new Error(errorMessage); 
      }

      // Xử lý khi đặt hàng thành công
      toast.success('Đặt hàng thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Chuyển hướng người dùng đến trang cảm ơn hoặc trang lịch sử đơn hàng
      navigate('/'); // Thay '/order-history' bằng đường dẫn thực tế

    } catch (error) {
      console.error('Lỗi:', error);
      toast.error(`Có lỗi xảy ra khi đặt hàng: ${error.message}`, { 
        // ... (toast options)
      });
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Giỏ hàng của bạn</h2>
      {cart ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.productName || `Sản phẩm #${item.productId}`}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()} VND</td>
                  <td>{(item.quantity * item.price).toLocaleString()} VND</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteItem(item.productId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right">
            <h3>Tổng tiền: {calculateTotalPrice().toLocaleString()} VND</h3>
            {/* Nút Thanh toán */}
            <button className="btn btn-primary" onClick={handlePlaceOrder}>
              Thanh toán
            </button>
          </div>
        </div>
      ) : (
        <p>Giỏ hàng trống</p>
      )}
    </div>
  );
}