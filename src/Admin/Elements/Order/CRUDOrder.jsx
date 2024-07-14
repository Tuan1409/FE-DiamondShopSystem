import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function CRUDOrder() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDetailDialog, setOpenOrderDetailDialog] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('Không tìm thấy mã thông báo xác thực.');
        return; // Hoặc chuyển hướng đến trang đăng nhập
      }
      try {
        const response = await fetch('https://localhost:7122/api/Order', {
          headers: {
            'Authorization': `Bearer ${token}` // Thêm header Authorization
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data.data);
        setOrders(data.data);
        console.log(orders);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusOptions = [
    "New Order",
    "Đang chuẩn bị hàng",
    "Đang giao hàng",
    "Thành công",
    "Thất bại",
  ];
  const handleOrderStatusChange = async (orderId, newStatus) => {

    const token = localStorage.getItem("token");
    if (!token) {
      console.error('Không tìm thấy mã thông báo xác thực.');
      return;
    }
    try {
      const response = await fetch(
        `https://localhost:7122/api/Order/change-status/${orderId}?status=${newStatus}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
      }
      setSnackbarOpen(true);
      // Cập nhật lại danh sách đơn hàng
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      // Hiển thị thông báo lỗi
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenOrderDetailDialog = (order) => {
    setSelectedOrder(order);
    setOpenOrderDetailDialog(true);
  };

  const handleCloseOrderDetailDialog = () => {
    setOpenOrderDetailDialog(false);
  };

  return (
    <div className="formCRUDContainer">
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {Array.isArray(orders) && orders.length > 0 ? (
            <>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Chi tiết</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders
                      .slice(page * rowsPerPage, Math.min((page * rowsPerPage) + rowsPerPage, orders.length))
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.userName}</TableCell>
                          <TableCell>{order.totalPrice}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {order.status}
                          </TableCell>
                          <TableCell>
                            {/* Hiển thị các nút thay đổi trạng thái */}
                            {statusOptions
                              .filter((status) => {
                                const currentStatus = order.status;
                                const allowedTransitions = {
                                  "New Order": ["Đang chuẩn bị hàng"],
                                  "Đang chuẩn bị hàng": ["Đang giao hàng"],
                                  "Đang giao hàng": ["Thành công"],
                                  "Thành công": ["Thất bại"],
                                };
                                return allowedTransitions[currentStatus]?.includes(status);
                              })
                              .map((status) => (
                                <Button
                                  key={status}
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleOrderStatusChange(order.id, status)}
                                >
                                  {status}
                                </Button>
                              ))}
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" color="primary" onClick={() => handleOpenOrderDetailDialog(order)}>
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
            </>
          ) : (
            <p>Không có đơn hàng nào.</p>
          )}
          {/* Dialog hiển thị chi tiết đơn hàng */}
          <Dialog open={openOrderDetailDialog} onClose={handleCloseOrderDetailDialog} fullWidth>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
            <DialogContent>
              {selectedOrder && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Thông tin đơn hàng</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="ID" value={selectedOrder.id} disabled fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Tên người dùng" value={selectedOrder.userName} disabled fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Tổng giá trị" value={selectedOrder.totalPrice} disabled fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Ngày đặt hàng" value={new Date(selectedOrder.orderDate).toLocaleDateString()} disabled fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Sản phẩm</Typography>
                    </Grid>
                    {selectedOrder.items.map((item, index) => (
                      <Grid item xs={12} key={index}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={6}>
                            <TextField label={`Sản phẩm ${index + 1}`} value={`Sản phẩm #${item.productId}`} disabled fullWidth />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField label="Số lượng" value={item.quantity} disabled fullWidth />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField label="Giá" value={item.price.toLocaleString()} disabled fullWidth />
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </DialogContent>
          </Dialog>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message="Thay đổi trạng thái thành công!"
          />
        </>
      )}
    </div>
  );
}