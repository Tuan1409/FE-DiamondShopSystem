import React, { useState, useEffect } from 'react';
import { TextField, Button, styled, TablePagination, Snackbar, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import UpdateIcon from '@mui/icons-material/Update';
import CreateProductType from './CreateProductType';
import DeleteIcon from '@mui/icons-material/Delete';
import { amber } from '@mui/material/colors';

const UpdateButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(amber[500]),
  backgroundColor: amber[500],
  '&:hover': {
    backgroundColor: amber[700],
  },
}));

export default function CRUDProductType() {
  const [productTypes, setProductTypes] = useState([]);
  const [materialProductType, setMaterialProductType] = useState(null);
  const [priceProductType, setPriceProductType] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);
  const [selectedForUpdate, setSelectedForUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(true);
  const [triggerRead, setTriggerRead] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch('https://localhost:7122/api/ProductType/GetProductTypes');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProductTypes(data.data); // Make sure data.data contains the array of product types
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };

    fetchProductTypes();
  }, [triggerRead]);

  const handleDelete = (id) => {
    setSelectedForDeletion(id);
    setShowDelete(true);
  };

  const handleUpdate = (id) => {
    setSelectedForUpdate(id);
    setShowUpdate(false);
    const productTypeToUpdate = productTypes.find(c => c.id === id);
    if (productTypeToUpdate) {
      setMaterialProductType(productTypeToUpdate.material);
      setPriceProductType(productTypeToUpdate.price);
    }
  };

  const handleSubmitDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token not found!");
      return;
    }

    if (id) {
      const url = `https://localhost:7122/api/ProductType/DeleteProductType/${id}`;
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Xóa sản phẩm thất bại');
        }
        setTriggerRead((prev) => !prev);
        setDeleteError(null);
        setSnackbarSeverity('success');
        setSnackbarMessage('Xóa loại sản phẩm thành công!');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        setDeleteError(error.message);
        setSnackbarSeverity('error');
        setSnackbarMessage('Xóa loại sản phẩm thất bại!');
        setOpenSnackbar(true);
      }
    }
    setShowDelete(false); // Close the delete confirmation
  };


  const UpdateProductType = async (Id, Material, Price) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token not found!");
      return;
    }
    const url = `https://localhost:7122/api/ProductType/UpdateProductType/${Id}`;
    const data = {
      material: Material,
      price: Price,
    };
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setShowUpdate(true);
      setTriggerRead((prev) => !prev);
      setSnackbarSeverity('success');
      setSnackbarMessage('Cập nhật loại sản phẩm thành công!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating product type:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Cập nhật loại sản phẩm thất bại!');
      setOpenSnackbar(true);
    }
  };

  const handleSubmitUpdate = (id, material, price) => {
    if (!validateForm()) {
      setSnackbarSeverity('warning');
      setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
      setOpenSnackbar(true);
      return;
    }
    UpdateProductType(id, material, price);
    setSelectedForUpdate(null);
    setMaterialProductType(null);
    setPriceProductType(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function validateForm() {
    return (
      materialProductType &&
      priceProductType
    );
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <div className="formCRUDContainer">
        <div>
          {Array.isArray(productTypes) && productTypes.length > 0 ? (
            <>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Trạng thái</th>
                    <th>Chất liệu</th>
                    <th>Giá</th>
                    <th></th>
                    <th>
                      <CreateProductType onProductTypeCreated={() => setTriggerRead((prev) => !prev)} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((productType, index) => (
                      <tr key={productType.id}>
                        <td>{index + 1}</td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>
                          {productType.isDeleted ? 'Đã hủy' : 'Đang sử dụng'}
                        </td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>
                          {selectedForUpdate !== productType.id && productType.material}

                          {selectedForUpdate === productType.id && !showUpdate && (
                            <>
                              <form
                                onSubmit={() =>
                                  handleSubmitUpdate(productType.id, materialProductType, priceProductType)
                                }
                              >
                                <TextField
                                  disabled
                                  id="outlined-disabled"
                                  label="Id"
                                  defaultValue={productType.id}
                                  sx={{ margin: '10px' }}
                                />

                                <TextField
                                  required
                                  defaultValue={productType.material}
                                  onChange={(e) => setMaterialProductType(e.target.value)}
                                  id="outlined-basic"
                                  label="Chất liệu"
                                  variant="outlined"
                                  sx={{ margin: '10px' }}
                                />
                                <br />

                                <TextField
                                  required
                                  type="number"
                                  defaultValue={productType.price}
                                  onChange={(e) => setPriceProductType(parseInt(e.target.value))}
                                  id="outlined-basic"
                                  label="Giá"
                                  variant="outlined"
                                  sx={{ margin: '10px' }}
                                  inputProps={{ min: 0 }}
                                />
                                <br />

                                <Button
                                  type="submit"
                                  value="Submit"
                                  variant="contained"
                                  color="success"
                                  size="large"
                                  endIcon={<SendIcon />}
                                  sx={{ margin: '5px' }}
                                >
                                  Xác nhận
                                </Button>
                                <Button
                                  type="button"
                                  value="Clear"
                                  onClick={() => {
                                    setShowUpdate(!showUpdate);
                                    setMaterialProductType(null);
                                    setPriceProductType(null);
                                    setSelectedForUpdate(null);
                                  }}
                                  variant="contained"
                                  size="large"
                                  color="error"
                                  endIcon={<CancelIcon />}
                                  sx={{ margin: '5px' }}
                                >
                                  Hủy bỏ
                                </Button>
                              </form>
                            </>
                          )}
                        </td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>{productType.price}</td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>
                          <Button
                            variant="outlined"
                            color="error"
                            size="large"
                            endIcon={<DeleteIcon />}
                            sx={{ margin: '5px', fontWeight: 'bold' }}
                            onClick={() => handleDelete(productType.id)}
                          >
                            XÓA
                          </Button>

                          {selectedForDeletion === productType.id && showDelete && (
                            <div>
                              {deleteError && <div style={{ color: 'red' }}>{deleteError}</div>}

                              <Button
                                type="submit"
                                value="Submit"
                                variant="contained"
                                color="success"
                                size="large"
                                endIcon={<SendIcon />}
                                sx={{ margin: '5px' }}
                                onClick={() => handleSubmitDelete(productType.id)}
                              >
                                Xác nhận
                              </Button>

                              <Button
                                type="button"
                                value="Clear"
                                onClick={() => setShowDelete(false)}
                                variant="contained"
                                size="large"
                                color="error"
                                endIcon={<CancelIcon />}
                                sx={{ margin: '5px' }}
                              >
                                Hủy bỏ
                              </Button>
                            </div>
                          )}
                        </td>
                        <td>
                          <UpdateButton
                            onClick={() => handleUpdate(productType.id)}
                            variant="contained"
                            size="large"
                            endIcon={<UpdateIcon />}
                            sx={{ margin: '5px', backgroundColor: '#ffc107' }}
                          >
                            Cập nhật
                          </UpdateButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={productTypes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <div>
              <h3>Đang tải...</h3>
            </div>
          )}
        </div>
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}