import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import UpdateIcon from '@mui/icons-material/Update';

export default function UpdateProduct({ onClick, ...props }) {
  const [id, setId] = useState(props.id || '');
  const [name, setName] = useState(props.name || '');
  const [price, setPrice] = useState(props.price || '');
  const [quantity, setQuantity] = useState(props.quantity || '');
  const [categoryId, setCategoryId] = useState(props.categoryId || null);
  const [productTypeId, setProductTypeId] = useState(props.productTypeId || null);
  const [primaryDiamondId, setPrimaryDiamondId] = useState(props.primaryDiamondId || null);
  const [subDiamondId, setSubDiamondId] = useState(props.subDiamondId || null);
  const [images, setImages] = useState([]); // For new images
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    // Populate the form fields with props when opening the modal
    setId(props.id || '');
    setName(props.name || '');
    setPrice(props.price || '');
    setQuantity(props.quantity || '');
    setCategoryId(props.categoryId || null);
    setProductTypeId(props.productTypeId || null);
    setPrimaryDiamondId(props.primaryDiamondId || null);
    setSubDiamondId(props.subDiamondId || null);
    // No need to set images here as you're likely handling new uploads
  };

  const handleClose = () => {
    setOpen(false);
    // Reset the form fields (optional)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('id', id); 
    formData.append('name', name);
    formData.append('price', parseFloat(price)); 
    formData.append('quantity', parseInt(quantity, 10)); 
    formData.append('categoryId', categoryId);
    formData.append('productTypeId', productTypeId);
    formData.append('primaryDiamondId', primaryDiamondId);
    formData.append('subDiamondId', subDiamondId);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]); 
    }

    try {
      const response = await fetch(`https://localhost:7122/api/Product/UpdateProduct/${id}`, { 
        method: 'PUT',
        body: formData, 
      });

      if (response.ok) {
        setOpenSnackbar(true);
        handleClose(); 
        props.onProductUpdated(); 
      } else {
        const errorData = await response.json(); 
        console.error('Lỗi khi cập nhật sản phẩm:', errorData);
        // Hiển thị thông báo lỗi (ví dụ: sử dụng Snackbar)
      }
    } catch (error) {
      console.error('Lỗi fetch:', error);
      // Xử lý lỗi fetch
    }
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // ... other functions (handleClear, handleImageChange)

  return (
    <div>
      <Button variant="contained" type="button" size="large" onClick={handleOpen} endIcon={<UpdateIcon />}>
        UPDATE
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '1px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h3 className="titleOfForm">UPDATE PRODUCT</h3>
          <form onSubmit={handleSubmit}>
            {/* ... form fields similar to CreateProduct ... */}
            {/* Include hidden input for ID */}
            <input type="hidden" value={id} /> 

            {/* ... other form elements (name, price, etc.) ... */}

            {/* Images */}
            <div className="row">
              <div className="col-12">
                <input
                  accept="image/*"
                  id="update-product-images"
                  multiple
                  type="file"
                  onChange={(e) => setImages(Array.from(e.target.files))} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="update-product-images">
                  <Button variant="contained" component="span">
                    Upload New Images
                  </Button>
                </label>
              </div>
            </div>
            <br />

            {/* ... submit and clear buttons ... */}
          </form>
        </Box>
      </Modal>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Update product successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}