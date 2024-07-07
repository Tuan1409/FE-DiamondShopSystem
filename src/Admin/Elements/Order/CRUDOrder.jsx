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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 

export default function CRUDOrder() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
                          <TableCell>{order.status}</TableCell>
                          
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
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message="Xóa đơn hàng thành công!"
          />
        </>
      )}
    </div>
  );
}