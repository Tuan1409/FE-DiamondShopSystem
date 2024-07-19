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
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
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
    // Tính tổng tiền các sản phẩm (không nhân discount)
    let subtotal = cart ? cart.items.reduce((total, item) => {
      return total + item.quantity * item.price; 
    }, 0) : 0;
  
    // Nhân tổng tiền với discountPercentage của giỏ hàng
    return subtotal * (cart.discountPercentage || 1); 
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
            quantity: 1
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
      window.location.reload()
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
  const handlePlaceOrder1 = async () => {
    if (!token) {
      console.error("Chưa đăng nhập!");
      return;
    }
    if (!address || !phoneNumber) {
      toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ và số điện thoại!", {
        // ... (toast options)
      });
      return;
    }
     
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      toast.error("Số điện thoại phải là 10 chữ số!", {
        // ... (toast options)
      });
      return;
    }
    try {
      const params = new URLSearchParams({
        address: address,
        phoneNumber: phoneNumber
      });
      const apiUrl = `https://localhost:7122/api/Order/place-order?${params.toString()}`;

      const res = await fetch(apiUrl, {
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
      navigate('/vieworder'); // Thay '/order-history' bằng đường dẫn thực tế

    } catch (error) {
      console.error('Lỗi:', error);
      toast.error(`Có lỗi xảy ra khi đặt hàng: ${error.message}`, { 
        // ... (toast options)
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      console.error("Chưa đăng nhập!");
      return;
    }
    if (!address || !phoneNumber) {
      toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ và số điện thoại!", {
        // ... (toast options)
      });
      return;
    }
  
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      toast.error("Số điện thoại phải là 10 chữ số!", {
        // ... (toast options)
      });
      return;
    }
  
    
  try {
    // 1. Gọi API PayOS/Checkout
    const payOsResponse = await fetch("https://localhost:7122/api/PayOS/Checkout", {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!payOsResponse.ok) {
      const errorData = await payOsResponse.json();
      throw new Error(errorData.message || "Lỗi khi gọi API PayOS/Checkout");
    }

    const payOsData = await payOsResponse.json();
    const redirectUrl = payOsData.url;

    // 2. Lưu thông tin đơn hàng (nếu cần)
    const orderInfo = { address, phoneNumber };
    localStorage.setItem('pendingOrder', JSON.stringify(orderInfo));

    // 3. Chuyển hướng đến URL PayOS 
    window.location.href = redirectUrl;
    
    // 4. Thiết lập timeout để đặt hà1ng sau 5 giây
    setTimeout(placeOrderAfterPayOS, 100); 

  } catch (error) {
    console.error("Lỗi:", error);
    toast.error(`Có lỗi xảy ra khi gọi API PayOS: ${error.message}`, {
      // ... (toast options)
    });
  }
};

// Hàm xử lý việc đặt hàng và chuyển hướng
const placeOrderAfterPayOS = async () => {
  try {
    // 1. Lấy thông tin đơn hàng (nếu cần)
    const storedOrderInfo = localStorage.getItem('pendingOrder');
    const { address, phoneNumber } = storedOrderInfo ? JSON.parse(storedOrderInfo) : {};

    // 2. Gọi API đặt hàng 
    const params = new URLSearchParams({ address, phoneNumber });
    const apiUrl = `https://localhost:7122/api/Order/place-order?${params.toString()}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage = errorData.message || `Lỗi khi đặt hàng: ${res.status}`;
      throw new Error(errorMessage);
    }

    // 3. Xóa thông tin đơn hàng trong localStorage (nếu cần)
    localStorage.removeItem('pendingOrder');

    // 4. Chuyển hướng đến trang /vieworder 
    navigate('/vieworder'); 

  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error);
    toast.error(`Có lỗi xảy ra khi đặt hàng: ${error.message}`, {
      // ... (toast options)
    });
    // Có thể chuyển hướng đến trang lỗi hoặc hiển thị thông báo lỗi cho người dùng
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
          <div className="text-right">
            {/* Hiển thị discountPercentage cho toàn bộ giỏ hàng */}
            {cart.discountPercentage > 0 && (
              <p>Giảm giá: {cart.discountPercentage.toFixed(1)}%</p>
            )}
            <h3>Tổng tiền: {calculateTotalPrice().toLocaleString()} VND</h3>
            {/* ... (Các phần tử khác) ... */}
          </div>
            {/* Nút Thanh toán */}
            <div className="form-group">
              <label htmlFor="address">Địa chỉ:</label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Số điện thoại:</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handlePlaceOrder1}>
              Shipcod
            </button>
            <button className="btn btn-primary" onClick={handlePlaceOrder}>
              Payment online 
            </button>
          </div>
        </div>
      ) : (
        <p>Giỏ hàng trống</p>
      )}
    </div>
  );
}