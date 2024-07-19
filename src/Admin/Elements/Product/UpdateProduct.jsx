import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  styled,
  FormControl,
  Snackbar,
  Alert,
  Menu,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import { amber } from '@mui/material/colors';
import UpdateIcon from '@mui/icons-material/Update';

export default function UpdateProduct({ open, onClose, product, onProductUpdated }) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState(0);
  const [wage, setWage] = useState(0);
  const [productTypeId, setProductTypeId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState(0);
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  useEffect(() => {
    // Cập nhật state khi product thay đổi
    if (product) {
      setName(product.name);
      setSize(product.size);
      setPrice(product.price);
      setWeight(product.weight);
      setWage(product.wage);
      setProductTypeId(product.productTypeId);
      setCategoryId(product.categoryId);
      setQuantity(product.quantity);
    }
  }, [product]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
      setOpenSnackbar(true);
      return;
      }
    updateProduct(
      product.id, // Sử dụng product.id
      name,
      weight,
      price,
      wage,
      productTypeId,
      categoryId,
      quantity
    );
  };

  const handleClear = () => {
    setName('');
    
    setPrice(0);
    setWage(0);
    setProductTypeId(null);
    setCategoryId(null);
    setQuantity(0);
  };
  const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://localhost:7122/api/Category/GetCategories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data);
                    console.log(categories, typeof categories);
                } else {
                    console.error("Lỗi khi lấy dữ liệu danh mục");
                }
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };

        fetchCategories(); 
    }, []);
  async function updateProduct(Id, Name, Weight, Price, Wage, ProductTypeId, CategoryId, Quantity) {
    const url = `https://localhost:7122/api/Product/UpdateProduct/${Id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`

        },
        body: JSON.stringify({
          Name,
          Weight,
          Price,
          Wage,
          ProductTypeId,
          CategoryId,
          Quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
        setOpenSnackbar(false); // Ẩn Snackbar khi có lỗi
      }

      onProductUpdated(); // Gọi hàm callback từ component cha
      onClose(); // Đóng modal
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  useEffect(() => {
    if (openSnackbar) {
      setTimeout(() => {
        window.location.reload();
      }, 100); // Reload sau 3 giây
    }
  }, [openSnackbar]);
  function validateForm() {
    
    return (
      name &&
      categoryId &&
      productTypeId &&
      weight &&
      wage &&
      quantity 
      
    );
  }
  return (
    <div>
    <Modal open={open} onClose={onClose}>
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
        <h3 className="titleOfForm">UPDATE Product</h3>
       
          
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12">
              <TextField
              disabled
                label="Name"
                variant="outlined"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <br />
          <div className="row">
            
            <div className="col-6">
              <TextField
              disabled
                label="Price"
                variant="outlined"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                fullWidth
                type="number" // Đặt type="number" cho input số
                
              />
            </div>
          </div>
          <br />
          <div className="row">
            
            <div className="col-6">
              <TextField
                  label="Weight"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  inputProps={{ min: 0, step: "any" }}
                />
    
              
            </div>
          </div>
          
          <br />
          <div className="row">
            <div className="col-6">
            <TextField
                  label="Wage"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  required
                  inputProps={{ min: 0, step: "any" }}
                />
            </div>
            <div className="col-6">
              <FormControl fullWidth>
                <InputLabel id="select-product-type">Product Type</InputLabel>
                <Select
                  labelId="select-product-type"
                  id="product-type"
                  variant="outlined"
                  label="Product Type"
                  value={productTypeId}
                  onChange={(e) => setProductTypeId(parseInt(e.target.value, 10))}
                  required
                  className="form-control"
                >
                  {/* Replace with actual product types from your API */}
                  <MenuItem value={1}>Gold</MenuItem>
                  <MenuItem value={2}>Platium</MenuItem>
                  <MenuItem value={3}>Sliver</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-6">
  
<FormControl fullWidth margin="normal">
  <InputLabel id="category-select-label">Category</InputLabel>
  <Select
    labelId="category-select-label"
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    required
  >
    {categories.map((category) => (
      <MenuItem key={category.id} value={category.id}>
        {category.name} {category.size === 0 ? `(length = ${category.length})` : `(size = ${category.size})`}
      </MenuItem>
    ))}
  </Select>
</FormControl>
            </div>
            <div className="col-6">
            <TextField
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  inputProps={{ min: 0 }}
                />
            </div>
          </div>
          <br />
          
          <div className="formSubmit">
            <Button
              type="submit"
              className="submitButton"
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
              sx={{
                margin: '5px',
              }}
            >
              Update
            </Button>
            <Button
              type="button"
              className="submitButton"
              variant="contained"
              size="large"
              color="error"
              endIcon={<CancelScheduleSendIcon />}
              sx={{
                margin: '5px',
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
    <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Update product successfully!
        </Alert>
      </Snackbar>
    </div>
 
  );
}