import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Snackbar,
  Alert,
  InputLabel,
  Input,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

export default function UpdateDiamond({ open, onClose, diamond, onDiamondUpdated }) {
  
  const [caratWeight, setCaratWeight] = useState('');
  const [cut, setCut] = useState('');
  const [color, setColor] = useState('');
  const [clarity, setClarity] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [origin, setOrigin] = useState('');
  const [updateImages, setUpdateImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // States and options for select inputs
  const [clarityId, setClarityId] = useState('');
  const cutOptions = ['Excellent', 'VeryGood', 'Good', 'Fair', 'Poor'];
  const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const clarityOptions = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];

  useEffect(() => {
    if (diamond) {
      
      setCaratWeight(diamond.caratWeight);
      setCut(diamond.cut);
      setColor(diamond.color);
      setClarity(diamond.clarity);
      setPrice(diamond.price);
      setQuantity(diamond.quantity);
      setOrigin(diamond.origin);

      // Set initial values for select inputs based on diamond data
      
    
    }
  }, [diamond]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
		setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
		setOpenSnackbar(true);
		return;
	  }
    const formData = new FormData();
    
    formData.append('Origin', origin);
    formData.append('CaratWeight', caratWeight);
    formData.append('Clarity', clarityId); // Send clarityId
    formData.append('Cut', cut); // Send cutId
    formData.append('Color', color); // Send colorId
    formData.append('Price', price);
    formData.append('Quantity', quantity);

    updateImages.forEach((image) => {
      formData.append('UpdateImages', image);
    });
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://localhost:7122/api/Diamond/UpdateDiamond/${diamond.id}`, {
        
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}` ,// Thêm header Authorization
            //'Content-Type': 'application/json' // Loại bỏ Content-Type khi sử dụng FormData
        },
        body: formData,
      });

      if (response.ok) {
        onDiamondUpdated();
        onClose();
        setOpenSnackbar(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating diamond:', error);
    }
  };

  // ... (handleCloseSnackbar and useEffect for openSnackbar)
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
      }, 100);
    }
  }, [openSnackbar]);
  const handleImageChange = (event) => {
    setUpdateImages([...event.target.files]);
  };
  function validateForm() {
    return (
		origin &&
		caratWeight &&
		clarity &&
		cut &&
		color &&
      price &&
      quantity&&
      updateImages
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
          <h3>UPDATE Diamond</h3>
          <form onSubmit={handleSubmit}>
            
            <TextField
              label="Origin Name"
              disabled
              variant="outlined"
              fullWidth
              margin="normal"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            <TextField
              label="Carat Weight"
              variant="outlined"
              fullWidth
              margin="normal"
              value={caratWeight}
              onChange={(e) => setCaratWeight(e.target.value)}
            />
           {/* Clarity Select */}
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
            {/* Cut Select */}
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

            {/* Color Select */}
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
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              margin="normal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              type="number"
              margin="normal"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 0 }}
            />
            {/* Image Upload */}
            <InputLabel htmlFor="update-images">Update Images</InputLabel>
            <Input
              accept="image/*"
              id="update-images"
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
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={onClose}
                startIcon={<CancelScheduleSendIcon />}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Update diamond successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}