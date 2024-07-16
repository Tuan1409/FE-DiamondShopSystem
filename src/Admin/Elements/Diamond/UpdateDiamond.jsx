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
  const [name, setName] = useState('');
  const [caratWeight, setCaratWeight] = useState('');
  const [cutName, setCutName] = useState('');
  const [color, setColor] = useState('');
  const [clarityName, setClarityName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [originName, setOriginName] = useState('');
  const [updateImages, setUpdateImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // States and options for select inputs
  const [clarityId, setClarityId] = useState('');
  const clarityOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    // ... add more options
  ];
  const [cutId, setCutId] = useState('');
  const cutOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    // ... add more options
  ];
  const [colorId, setColorId] = useState('');
  const colorOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    // ... add more options
  ];

  useEffect(() => {
    if (diamond) {
      setName(diamond.name);
      setCaratWeight(diamond.caratWeight);
      setCutName(diamond.cutName);
      setColor(diamond.color);
      setClarityName(diamond.clarityName);
      setPrice(diamond.price);
      setQuantity(diamond.quantity);
      setOriginName(diamond.originName);

      // Set initial values for select inputs based on diamond data
      setClarityId(diamond.clarityId); // Assuming diamond has clarityId
      setCutId(diamond.cutId); // Assuming diamond has cutId
      setColorId(diamond.colorId); // Assuming diamond has colorId
    }
  }, [diamond]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('Name', name);
    formData.append('OriginName', originName);
    formData.append('CaratWeight', caratWeight);
    formData.append('ClarityName', clarityId); // Send clarityId
    formData.append('CutName', cutId); // Send cutId
    formData.append('Color', colorId); // Send colorId
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
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Origin Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={originName}
              onChange={(e) => setOriginName(e.target.value)}
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
              <InputLabel id="clarity-select-label">Clarity</InputLabel>
              <Select
                labelId="clarity-select-label"
                value={clarityId}
                onChange={(e) => setClarityId(e.target.value)}
              >
                {clarityOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Cut Select */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="cut-select-label">Cut</InputLabel>
              <Select
                labelId="cut-select-label"
                value={cutId}
                onChange={(e) => setCutId(e.target.value)}
              >
                {cutOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Color Select */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-select-label">Color</InputLabel>
              <Select
                labelId="color-select-label"
                value={colorId}
                onChange={(e) => setColorId(e.target.value)}
              >
                {colorOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
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
            />
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              margin="normal"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {/* Image Upload */}
            <InputLabel htmlFor="update-images">Update Images</InputLabel>
            <Input
              accept="image/*"
              id="update-images"
              type="file"
              multiple
              onChange={handleImageChange}
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