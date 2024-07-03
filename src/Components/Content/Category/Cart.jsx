import React, { useState, useEffect } from 'react';
import './Cart.css'; // Import CSS riêng cho trang giỏ hàng (nếu có)

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const fetchCartData = async () => {
      if (!token) {
        // Xử lý khi chưa đăng nhập, ví dụ: chuyển hướng đến trang đăng nhập
        console.error("Chưa đăng nhập!");
        return;
      }

      try {
        const res = await fetch('https://localhost:7122/api/Cart/view-cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi khi lấy dữ liệu giỏ hàng. Status: ${res.status}`);
        }

        const data = await res.json();
        setCart(data.data); // Lưu dữ liệu giỏ hàng vào state
      } catch (error) {
        console.error('Lỗi:', error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      }
    };

    fetchCartData();
  }, [token]); // Chạy lại effect khi token thay đổi

  // Tính tổng tiền
  const calculateTotalPrice = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div className="container mt-5">
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
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right">
            <h3>Tổng tiền: {calculateTotalPrice().toLocaleString()} VND</h3>
          </div>
          {/* Thêm các nút hoặc chức năng khác cho giỏ hàng (ví dụ: Xóa sản phẩm, Cập nhật số lượng, Thanh toán) */}
        </div>
      ) : (
        <p>Giỏ hàng trống</p>
      )}
    </div>
  );
}