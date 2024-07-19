import React, { useState, useEffect } from 'react';
import { TextField, Button, Box,Snackbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import Modal from '@mui/material/Modal';

export default function CreateCategory(props) {
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [name, setName] = useState('');
  const [size, setSize] = useState(0);
  const [length, setLength] = useState(0);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // For Snackbar severity

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName('');
    setSize(0);
    setLength(0);
    setData(null);
  };

  useEffect(() => {
    // Kiểm tra trường success trong response
    if (data && data.success) {
      setName('');
      setSize(0);
      setLength(0);
      setSnackbarSeverity('success');
      setSnackbarMessage('Tạo danh mục thành công!');
      setOpenSnackbar(true);
      handleClose(); 
    } else if (data && !data.success) {
      setSnackbarSeverity('error');
      setSnackbarMessage(data.message || 'Tạo danh mục thất bại!'); // Lấy message từ API
      setOpenSnackbar(true);
    }
  }, [data]);
  const handleSubmit = (event) => {
    event.preventDefault();
    // Gọi hàm CreateCaratWeight, truyền weight và price như là các đối số
    if (!validateForm()) {
      setSnackbarMessage('Vui lòng nhập tên và chỉ một trong hai trường Size hoặc Length phải bằng 0');
      setOpenSnackbar(true);
      return;
      }
    Create(name, size, length);
  };

  const handleClear = () => {
    setName('');
    setSize(0);
    setLength(0);
    setData(null);
  };
  function Create(Name, Size, Length) {
    const url = 'https://localhost:7122/api/Category/CreateCategory';
    const formData = new FormData(); // Tạo FormData
    formData.append('name', Name);
    formData.append('size', Size);
    formData.append('length', Length);
    formData.append('isDeleted', false);
    fetch(url, {
      method: 'POST',
      body: formData // Sử dụng FormData
    })
      .then(response => response.json())
      .then(responseData => {
        setData(responseData);
        props.onCategoryCreated();
      })
      .catch((error) => console.error('Error:', error));
  }
  function validateForm() {
    // Kiểm tra xem name có giá trị và chỉ một trong hai size hoặc length bằng 0
    return name && ((size === 0 && length !== 0) || (size !== 0 && length === 0)); 
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <Button variant="contained" type="button" size="large" onClick={handleOpen}>
        Create
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
          <h3 className='titleOfForm'>CREATE CATEGORY</h3>
          <div>
            <form onSubmit={handleSubmit} className='row' style={{
              maxWidth: '25vw'
            }}>
              <div className='col'>
                <TextField
                required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  className='form-control'
                />
              </div>
              <div className='col'>
                <TextField
                required
                  type="number"
                  value={size}
                  onChange={e => setSize(parseInt(e.target.value))}
                  id="outlined-basic"
                  label="Size"
                  variant="outlined"
                  className='form-control'
                  inputProps={{ min: 0 }}
                />
              </div>
              <div className='col'>
                <TextField
                required
                  type="number"
                  value={length}
                  onChange={e => setLength(parseInt(e.target.value))}
                  id="outlined-basic"
                  label="Length"
                  variant="outlined"
                  className='form-control'
                  inputProps={{ min: 0 }}
                />
              </div>
              {/* {
                data && (data.status === 400 ? (
                  <h3>{data.errors.Price}</h3>
                ) : (
                  <h3>Create successful</h3>
                ))
              } */}
              <div className='formSubmit' >
                <Button
                  type="submit"
                  className='submitButton'
                  value="Submit" variant="contained"
                  size="large" endIcon={<SendIcon />}
                  sx={{
                    margin: '5px',
                  }}>
                  Send
                </Button>
                <Button type="button"
                  value="Clear" onClick={handleClear}
                  className='submitButton'
                  variant="contained" size="large" color="error"
                  endIcon={<CancelScheduleSendIcon />}
                  sx={{
                    margin: '5px',
                  }}>
                  Clear
                </Button>
              </div>
            </form>
          </div>
        </Box>

      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        message={snackbarMessage}
        onClose={() => setOpenSnackbar(false)}
      />
    </div>
  );
}