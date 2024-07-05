import React, { useState } from 'react';
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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

export default function CreateProduct(props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [productTypeId, setProductTypeId] = useState(null);
  const [primaryDiamondId, setPrimaryDiamondId] = useState(null); 
  const [subDiamondId, setSubDiamondId] = useState(null);   
  const [images, setImages] = useState([]); 
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form fields
    setName('');
    setPrice('');
    setQuantity('');
    setCategoryId(null);
    setProductTypeId(null);
    setPrimaryDiamondId(null);
    setSubDiamondId(null);
    setImages([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', parseFloat(price)); 
    formData.append('quantity', parseInt(quantity, 10)); 
    formData.append('categoryId', categoryId);
    formData.append('productTypeId', productTypeId);
    formData.append('primaryDiamondId', primaryDiamondId); 
    formData.append('subDiamondId', subDiamondId);  

    // Append each image file to FormData
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]); 
    }

    createProduct(formData);
  };

  const handleClear = () => {
    // Reset form fields (same as handleClose)
    setName('');
    setPrice('');
    // ... reset other fields
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  async function createProduct(formData) {
    const url = 'https://localhost:7122/api/Product/CreateProduct'; 

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, 
      });

      if (response.ok) {
        setSnackbarMessage('Tạo sản phẩm thành công!');
        setOpenSnackbar(true);

        setTimeout(() => {
          handleClose(); 
        }, 1000);

        props.onProductCreated(); 
      } else {
        const errorData = await response.json(); 
        setSnackbarMessage(errorData.ErrorMessage || 'Lỗi khi tạo sản phẩm!');
        setOpenSnackbar(true);
        throw new Error(errorData.ErrorMessage || 'Lỗi khi tạo sản phẩm!');
      }
    } catch (error) {
      console.error('Lỗi fetch:', error);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" type="button" size="large" onClick={handleOpen}>
          Create
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
              width: 800,
              bgcolor: 'background.paper',
              border: '1px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <h3 className="titleOfForm">CREATE PRODUCT</h3>
            <div>
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="row">
                  <div className="col-12">
                    <TextField
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      className="form-control"
                      fullWidth 
                    />
                  </div>
                </div>
                <br />
                {/* Price and Quantity */}
                <div className="row">
                  <div className="col-6">
                    <TextField
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      id="outlined-basic"
                      label="Price"
                      variant="outlined"
                      className="form-control"
                      fullWidth 
                    />
                  </div>
                  <div className="col-6">
                    <TextField
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      id="outlined-basic"
                      label="Quantity"
                      variant="outlined"
                      className="form-control"
                      fullWidth 
                    />
                  </div>
                </div>
                <br />
                {/* Category */}
                <div className="row">
                  <div className="col-12">
                    <FormControl fullWidth> 
                      <InputLabel id="category-select-label">Category</InputLabel>
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        variant="outlined"
                        label="Category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
                        className="form-control"
                        sx={{ padding: '0' }} 
                      >
                        {/* Replace with your category options */}
                        <MenuItem value={1}>Category 1</MenuItem>
                        <MenuItem value={2}>Category 2</MenuItem>
                        {/* ... more categories */}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <br />
                {/* Product Type */}
                <div className="row">
                  <div className="col-12">
                    <FormControl fullWidth>
                      <InputLabel id="productType-select-label">Product Type</InputLabel>
                      <Select
                        labelId="productType-select-label"
                        id="productType-select"
                        variant="outlined"
                        label="Product Type"
                        value={productTypeId}
                        onChange={(e) => setProductTypeId(parseInt(e.target.value, 10))} 
                        className="form-control"
                        sx={{ padding: '0' }} 
                      >
                        {/* Replace with your product type options */}
                        <MenuItem value={1}>Product Type 1</MenuItem>
                        <MenuItem value={2}>Product Type 2</MenuItem>
                        {/* ... more product types */}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <br />
                {/* Primary Diamond */}
                <div className="row">
                  <div className="col-12">
                    <FormControl fullWidth>
                      <InputLabel id="primaryDiamond-select-label">Primary Diamond</InputLabel>
                      <Select
                        labelId="primaryDiamond-select-label"
                        id="primaryDiamond-select"
                        variant="outlined"
                        label="Primary Diamond"
                        value={primaryDiamondId}
                        onChange={(e) => setPrimaryDiamondId(parseInt(e.target.value, 10))}
                        className="form-control"
                        sx={{ padding: '0' }}
                      >
                        {/* Replace with your primary diamond options from API */}
                        {/* Example: */}
                        {/* {primaryDiamonds.map((diamond) => (
                            <MenuItem key={diamond.id} value={diamond.id}>
                              {diamond.name}
                            </MenuItem>
                          ))} */}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <br />
                {/* Sub Diamond */}
                <div className="row">
                  <div className="col-12">
                    <FormControl fullWidth>
                      <InputLabel id="subDiamond-select-label">Sub Diamond</InputLabel>
                      <Select
                        labelId="subDiamond-select-label"
                        id="subDiamond-select"
                        variant="outlined"
                        label="Sub Diamond"
                        value={subDiamondId}
                        onChange={(e) => setSubDiamondId(parseInt(e.target.value, 10))}
                        className="form-control"
                        sx={{ padding: '0' }}
                      >
                        {/* Replace with your sub diamond options from API */}
                        {/* Example: */}
                        {/* {subDiamonds.map((diamond) => (
                            <MenuItem key={diamond.id} value={diamond.id}>
                              {diamond.name}
                            </MenuItem>
                          ))} */}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <br />

                {/* Images */}
                <div className="row">
                  <div className="col-12">
                    <input
                      accept="image/*" 
                      id="contained-button-file"
                      multiple 
                      type="file"
                      onChange={(e) => setImages(Array.from(e.target.files))}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="contained-button-file">
                      <Button variant="contained" component="span">
                        Upload Images
                      </Button>
                    </label>
                  </div>
                </div>
                <br />

                <div className="formSubmit">
                  <Button
                    type="submit"
                    className="submitButton"
                    value="Submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ margin: '5px' }}
                  >
                    Send
                  </Button>
                  <Button
                    type="button"
                    value="Clear"
                    onClick={handleClear}
                    className="submitButton"
                    variant="contained"
                    size="large"
                    color="error"
                    endIcon={<CancelScheduleSendIcon />}
                    sx={{ margin: '5px' }}
                  >
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
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </div>
    </>
  );
}