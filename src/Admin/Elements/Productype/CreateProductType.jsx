import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import Modal from '@mui/material/Modal';

export default function CreateProductType(props) {
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState(0);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Add state for Snackbar

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMaterial('');
    setPrice(0);
    setData(null);
  };

  useEffect(() => {
    // This effect runs when `data` changes
    if (data && data.status !== 400) {
      // Assuming `data.status` not being 400 means success
      setMaterial(''); // Reset the nameCategory only on successful creation
      setPrice(0);
      setOpenSnackbar(true); // Open Snackbar when creation is successful
      setOpen(false); // Close the Modal after successful creation
    }
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
      setOpenSnackbar(true);
      return;
      }
    // Gọi hàm CreateCaratWeight, truyền weight và price như là các đối số
    Create(material, price);
  };

  const handleClear = () => {
    setMaterial('');
    setPrice(0);
    setData(null);
  };

  function Create(Material, Price) {
    const token = localStorage.getItem('token');
    const url = 'https://localhost:7122/api/ProductType/CreateProductType';
    const formData = new FormData();
    formData.append('material', Material);
    formData.append('price', Price);
    formData.append('isDeleted', false);

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // Thêm token vào header
      },
      body: formData 
    })
      .then(response => {
        if (!response.ok) { // Kiểm tra response status
          // Xử lý trường hợp response không thành công (status code không phải 2xx)
          return response.json().then(errorData => {
            // Lấy thông tin lỗi từ response body
            throw new Error(errorData.message || 'Lỗi khi tạo Product Type'); 
          });
        }
        return response.json(); // Nếu response ok, parse JSON như bình thường
      })
      .then(responseData => {
        setData(responseData);
        props.onProductTypeCreated();
      })
      .catch((error) => {
        console.error('Error:', error);
        // Hiển thị thông báo lỗi cho người dùng
        alert(error.message); 
      });
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  function validateForm() {
    
    return (
		material &&
		price 
    );
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <Button variant="contained" type="button" size="large" onClick={handleOpen}>
        Tạo mới
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '1px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <h3 className='titleOfForm'>TẠO LOẠI SẢN PHẨM</h3>
          <div>
            <form onSubmit={handleSubmit} className='row' style={{
              maxWidth: '25vw'
            }}>
              <div className='col'>
                <TextField
                  type="text"
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  id="outlined-basic"
                  label="Chất liệu"
                  variant="outlined"
                  className='form-control'
                />
              </div>
              <div className='col'>
                <TextField
                required
                  type="number"
                  value={price}
                  onChange={e => setPrice(parseInt(e.target.value))}
                  id="outlined-basic"
                  label="Giá"
                  variant="outlined"
                  className='form-control'
                  inputProps={{ min: 0 }}
                />
              </div>
              {
                data && (data.status === 400 ? (
                  <h3>{data.errors.Price}</h3>
                ) : (
                  <h3>Tạo thành công</h3>
                ))
              }
              <div className='formSubmit' >
                <Button
                  type="submit"
                  className='submitButton'
                  value="Submit" variant="contained"
                  size="large" endIcon={<SendIcon />}
                  sx={{
                    margin: '5px',
                  }}>
                  Gửi
                </Button>
                <Button type="button"
                  value="Clear" onClick={handleClear}
                  className='submitButton'
                  variant="contained" size="large" color="error"
                  endIcon={<CancelScheduleSendIcon />}
                  sx={{
                    margin: '5px',
                  }}>
                  Xóa
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Tạo loại sản phẩm thành công!
        </Alert>
      </Snackbar>
    </div>
  );
}