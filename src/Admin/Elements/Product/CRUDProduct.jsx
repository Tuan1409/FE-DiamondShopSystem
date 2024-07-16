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
  DialogTitle, // Import DialogTitle
  DialogContent, 
  DialogContentText,
  TextField,
  Grid, 
  Typography,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import CreateProduct from './CreateProduct';
import DeleteIcon from '@mui/icons-material/Delete'; // Nhớ import DeleteIcon
import UpdateProduct from './UpdateProduct'; // Import UpdateProduct 
export default function ReadProduct() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // Thêm state này 
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openProductDetailsDialog, setOpenProductDetailsDialog] = useState(false); // Thêm state này
  
  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setOpenUpdateModal(true); // Mở modal
  };
  const handleCloseUpdateModal = () => {
    setSelectedProduct(null);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://localhost:7122/api/Product/GetProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setProducts(data.data); 
        console.log(products);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [openUpdateModal]); 
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://localhost:7122/api/Product/DeleteProduct/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Xóa sản phẩm thành công, cập nhật lại danh sách sản phẩm
        setProducts(products.filter((product) => product.id !== productId));
        setSnackbarOpen(true); // Hiển thị Snackbar
        setTimeout(() => {
          window.location.reload();
        }, 100); 
      } else {
        console.error('Error deleting product:', response.status);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  
  const handleOpenProductDetailsDialog = (product) => {
    setSelectedProduct(product);
    setOpenProductDetailsDialog(true);
  };

  const handleCloseProductDetailsDialog = () => {
    setOpenProductDetailsDialog(false);
  };




  return (
    <div className='formCRUDContainer'>
      {isLoading ? ( 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        
      ) : (
        <> 
               <TableCell><CreateProduct onAccountCreated={() => setTriggerRead(prev => !prev)}></CreateProduct></TableCell>
          {/* Kiểm tra products là mảng và có dữ liệu */}
          {Array.isArray(products) && products.length > 0 ? ( 
            <>
            
              <TableContainer>
                <Table stickyHeader>
         
                  <TableHead>
                    
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Images</TableCell>
                      <TableCell>Status</TableCell> {/* Thêm cột trạng thái */} 
                      <TableCell>chức năng</TableCell> 

                      
                    </TableRow>
                    
                    
                  </TableHead>
                  <TableBody>
                    {products
                      .slice(
                        page * rowsPerPage,
                        Math.min((page * rowsPerPage) + rowsPerPage, products.length)
                      )
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.price.toLocaleString()} VND</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {product.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={product.name}
                                style={{ maxWidth: '100px' }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            {product.isDeleted ? 'Hết hàng' : 'Còn hàng'}
                          </TableCell> {/* Hiển thị trạng thái */}
                          <TableCell>
                          <Button variant="contained" color="primary" onClick={() => handleOpenProductDetailsDialog(product)}>
                              Xem chi tiết
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </Button>
                            {/* Update button */}
                            <Button variant="outlined" color="warning" size="large" onClick={() => handleUpdate(product)}>
                              Update
                            </Button>
                            
                            {/* UpdateProduct modal */}
                            <UpdateProduct
                              open={!!selectedProduct && selectedProduct.id === product.id}
                              onClose={handleCloseUpdateModal}
                              product={selectedProduct}
                              onProductUpdated={() => {
                                // Sau khi cập nhật sản phẩm thành công, 
                                // đóng modal và fetch lại danh sách sản phẩm
                                handleCloseUpdateModal();
                                
                              }}
                            /> 
                          </TableCell>
                
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={products.length}
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
            <p>Không có sản phẩm nào.</p> 
          )}
            <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000} // Ẩn sau 3 giây
          onClose={handleCloseSnackbar}
          message="Xóa sản phẩm thành công!"
        />

        {/* Dialog hiển thị chi tiết sản phẩm */}
        <Dialog open={openProductDetailsDialog} onClose={handleCloseProductDetailsDialog} fullWidth>
  <DialogTitle>Chi tiết sản phẩm #{selectedProduct?.id}</DialogTitle>
  <DialogContent>
    {selectedProduct && (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Thông tin sản phẩm</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="ID" value={selectedProduct.id} disabled fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Tên sản phẩm" value={selectedProduct.name} disabled fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Loại sản phẩm" value={selectedProduct.productType.material} disabled fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Danh mục" value={selectedProduct.category.name} disabled fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Trọng lượng" value={selectedProduct.weight} disabled fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Giá" value={selectedProduct.price.toLocaleString()} disabled fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Số lượng" value={selectedProduct.quantity} disabled fullWidth />
          </Grid>

          {/* Hiển thị thông tin Primary Diamond */}
          {selectedProduct.primaryDiamonds.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Kim cương chính</Typography>
            </Grid>
          )}
          {selectedProduct.primaryDiamonds.map((diamond, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <TextField label="Tên" value={diamond.name} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Trọng lượng" value={diamond.caratWeight} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Độ tinh khiết" value={diamond.clarity} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Độ cắt" value={diamond.cut} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Màu sắc" value={diamond.color} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Giá" value={diamond.price.toLocaleString()} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Số lượng" value={diamond.quantity} disabled fullWidth />
                </Grid>
              </Grid>
            </Grid>
          ))}

          {/* Hiển thị thông tin Sub Diamond */}
          {selectedProduct.subDiamonds.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Kim cương phụ</Typography>
            </Grid>
          )}
          {selectedProduct.subDiamonds.map((diamond, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <TextField label="Tên" value={diamond.name} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Trọng lượng" value={diamond.caratWeight} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Độ tinh khiết" value={diamond.clarity} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Độ cắt" value={diamond.cut} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Màu sắc" value={diamond.color} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Giá" value={diamond.price.toLocaleString()} disabled fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Số lượng" value={diamond.quantity} disabled fullWidth />
                </Grid>
              </Grid>
            </Grid>
          ))}

          {/* ... thêm các trường thông tin khác nếu cần ... */}
        </Grid>
      </>
    )}
  </DialogContent>
</Dialog>
        </>
      )}
    </div>
  );
}