import React, { useState } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  InputLabel,
  Input,
  Snackbar,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

export default function CreateDiamond(props) {
  
  const [caratWeight, setCaratWeight] = useState('');
  const [cut, setCut] = useState('');
  const [color, setColor] = useState('');
  const [clarity, setClarity] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [origin, setOrigin] = useState('');
  const [diamondImages, setDiamondImages] = useState([]);

  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Danh sách các tùy chọn cho Cut, Color, Clarity
  const cutOptions = ['Excellent', 'VeryGood', 'Good', 'Fair', 'Poor'];
  const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const clarityOptions = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
  const originOptios=['GIA',
     'IGI',
	'AGS',
	'HRD',
	'EGL',
	'CGL'];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName('');
    setCaratWeight('');
    setCut('');
    setColor('');
    setClarity('');
    setPrice('');
    setQuantity('');
    setOrigin('');
    setDiamondImages([]);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
	if (!validateForm()) {
		setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
		setOpenSnackbar(true);
		return;
	  }
    const formData = new FormData();
   
    formData.append('Origin', origin);
    formData.append('CaratWeight', parseFloat(caratWeight)); // Chuyển đổi sang số
    formData.append('Clarity', clarity);
    formData.append('Cut', cut);
    formData.append('Color', color);
    formData.append('Price', parseFloat(price)); // Chuyển đổi sang số
    formData.append('Quantity', parseInt(quantity)); // Chuyển đổi sang số nguyên

    diamondImages.forEach((image) => {
      formData.append('DiamondImages', image);
    });
	const token = localStorage.getItem('token'); 
    try {
      const response = await fetch('https://localhost:7122/api/Diamond/CreateDiamond', {
        method: 'POST',
		headers: {
            'Authorization': `Bearer ${token}` ,// Thêm header Authorization
            //'Content-Type': 'application/json' // Loại bỏ Content-Type khi sử dụng FormData
        },
        body: formData,
      });

      if (response.ok) {
        setSnackbarMessage('Diamond created successfully!');
        setOpenSnackbar(true);
        setTimeout(handleClose, 500);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.ErrorMessage || 'Error creating diamond');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleImageChange = (event) => {
    setDiamondImages([...event.target.files]);
  };
  function validateForm() {
    return (
		origin &&
		caratWeight &&
		clarity &&
		cut &&
		color &&
      price &&
      quantity
    );
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" type="button" size="large" onClick={handleOpen}>
          Create Diamond
        </Button>

        <Modal open={open} onClose={handleClose}>
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
            <Typography variant="h6" component="h2" gutterBottom>
              CREATE DIAMOND
            </Typography>

            <form onSubmit={handleSubmit}>
              
              {/* <TextField
                label="Origin Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              /> */}
			      <FormControl fullWidth margin="normal" >
                <InputLabel id="cut-label">Origin</InputLabel>
                <Select
                  labelId="cut-label"
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
				  required
                >
                  {originOptios.map((cut) => (
                    <MenuItem key={cut} value={cut}>
                      {cut}
                    </MenuItem>
                  ))}
                </Select>
				
              </FormControl>
              <TextField
                label="Carat Weight"
                variant="outlined"
                fullWidth
                margin="normal"
                value={caratWeight}
                onChange={(e) => setCaratWeight(e.target.value)}
				required
                type="number" // Đảm bảo người dùng chỉ nhập số
              />

              {/* Sử dụng Select cho Cut, Color, Clarity */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="cut-label">Cut</InputLabel>
                <Select
                  labelId="cut-label"
                  id="cut"
                  value={cut}
                  onChange={(e) => setCut(e.target.value)}
				  required
                >
                  {cutOptions.map((cut) => (
                    <MenuItem key={cut} value={cut}>
                      {cut}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                  labelId="color-label"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
				  required
                >
                  {colorOptions.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="clarity-label">Clarity</InputLabel>
                <Select
                  labelId="clarity-label"
                  id="clarity"
                  value={clarity}
                  onChange={(e) => setClarity(e.target.value)}
				  required
                >
                  {clarityOptions.map((clarity) => (
                    <MenuItem key={clarity} value={clarity}>
                      {clarity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                margin="normal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
				required
                type="number" // Đảm bảo người dùng chỉ nhập số
              />
              <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                margin="normal"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
				required
                type="number" // Đảm bảo người dùng chỉ nhập số nguyên
              />

              <InputLabel htmlFor="diamond-images">Diamond Images</InputLabel>
              <Input
                accept="image/*"
                id="diamond-images"
                type="file"
                multiple
                onChange={handleImageChange}
				required
              />

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<SendIcon />}
                  sx={{ mr: 2 }}
                >
                  Create
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClose}
                  startIcon={<CancelScheduleSendIcon />}
                >
                  Cancel
                </Button>
              </div>
            </form>
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