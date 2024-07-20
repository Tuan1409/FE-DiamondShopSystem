// Components/Content/Category/ViewOrder.jsx
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ViewOrder() {
    const [orders, setOrders] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                console.error("Chưa đăng nhập!");
                return;
            }

            try {
                const res = await fetch('https://localhost:7122/api/Order/orders/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`Lỗi khi lấy dữ liệu đơn hàng: ${res.status}`);
                }

                const data = await res.json();
                setOrders(data.data);
            } catch (error) {
                console.error('Lỗi:', error);
                toast.error('Có lỗi xảy ra khi lấy dữ liệu đơn hàng!', {
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

        fetchOrders();
    }, [token]);

    const calculateTotalPrice = (order) => {
        return order ? order.items.reduce((total, item) => total + item.quantity * item.price, 0) : 0;
    };

    const handleViewOrderDetail = (order) => {
        setSelectedOrder(order); // Lưu trữ đơn hàng được chọn
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h2>Lịch sử đơn hàng</h2>
            {orders ? (
                <div>
                    {orders.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn hàng</th>

                                    <th>Ngày đặt hàng</th>
                                    <th>Khuyến mãi</th>
                                    <th>Tổng tiền</th>
                                    <th>Thanh toán</th>
                                    <th>Trạng thái</th>
                                    <th>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{order.id}</td>
                                        <td>{order.orderDate}</td>
                                        <td>{order.discountPercentage*100}%</td>
                                        

                                       
                                        

                                        <td>{order.totalPrice.toLocaleString()} VND</td>
                                        <td>{order.paymentName}</td>
                                        <td>{order.status}</td>
                                        <td>
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => handleViewOrderDetail(order)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Bạn chưa có đơn hàng nào.</p>
                    )}

                    {/* Hiển thị chi tiết đơn hàng khi có đơn hàng được chọn */}
                    {selectedOrder && (
                        <div className="mt-3">
                            <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>

                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>Sản phẩm #{item.productId}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price.toLocaleString()} VND</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <p>Đang tải dữ liệu đơn hàng...</p>
            )}
        </div>
    );
}