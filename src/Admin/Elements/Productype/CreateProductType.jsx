import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import Modal from '@mui/material/Modal';

export default function CreateProductType(props) {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName('');
    setData(null);
  };

  useEffect(() => {
    // This effect runs when `data` changes
    if (data && data.status !== 400) {
      // Assuming `data.status` not being 400 means success
      setName(''); // Reset the nameCategory only on successful creation
    }
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Gọi hàm CreateCaratWeight, truyền weight và price như là các đối số
    Create(name);
  };

  const handleClear = () => {
    setName('');
    setData(null);
  };

  function Create(Name) {
    const url = 'https://localhost:7122/api/ProductType/CreateProductType';
    const formData = new FormData(); // Tạo FormData
    formData.append('name', Name);
    formData.append('isDeleted', false);

    fetch(url, {
      method: 'POST',
      body: formData // Sử dụng FormData
    })
      .then(response => response.json())
      .then(responseData => {
        setData(responseData);
        props.onProductTypeCreated();
      })
      .catch((error) => console.error('Error:', error));
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
                  value={name}
                  onChange={e => setName(e.target.value)}
                  id="outlined-basic"
                  label="Tên"
                  variant="outlined"
                  className='form-control'
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
    </div>
  );
}