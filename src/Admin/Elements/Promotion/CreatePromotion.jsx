import React, { useState, useEffect } from 'react';
import { 
    Button, Modal, Box, TextField, 
    Select, InputLabel, MenuItem, 
    OutlinedInput, FormControl, Snackbar,
    Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import { ToastContainer, toast } from 'react-toastify'; 
export default function CreatePromotion(props) {
    
    const [name, setName] = useState('');
    const [point, setPoint] = useState(0); 
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [startDate, setStartDate] = useState(new Date()); // Use Date object
    const [endDate, setEndDate] = useState(new Date());
    const [status, setStatus] = useState(false); 

    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        // Reset form fields
        setPoint('');
        setDiscountPercentage('');
       
       
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (discountPercentage < 0 || discountPercentage >= 100) { 
          toast.error('Discount must be between 0 and 100!', { 
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          return; // Don't submit if invalid
      }
        try {
            console.log('Before Fetch: point=', point, 'discountPercent=', discountPercentage); // Logging before fetch
            const token = localStorage.getItem("token");

            // Tạo FormData object
            const formData = new FormData();
            formData.append('Point', point); // Thêm dữ liệu Point
            formData.append('DiscountPercentage', discountPercentage/100); // Thêm dữ liệu DiscountPercentage

            const response = await fetch('https://localhost:7122/api/Promotion/CreatePromotion', { 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` ,// Thêm header Authorization
                    //'Content-Type': 'application/json' // Loại bỏ Content-Type khi sử dụng FormData
                },
                body: formData // Gửi FormData
            });
            
            if (response.ok) {
                setSnackbarMessage('Promotion created successfully!');
                setOpenSnackbar(true);
                 
                setTimeout(handleClose, 500); 
                window.location.reload(); 
            } else {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(errorData.message || 'Error creating promotion');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setSnackbarMessage(error.message);
            setOpenSnackbar(true);
        }
    };

    return (
      <>
      
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" type="button" size="large" onClick={handleOpen}>
            Create Promotion
          </Button>
    
          <Modal open={open} onClose={handleClose}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 800,
              bgcolor: 'background.paper',
              border: '1px solid #000',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography variant="h6" component="h2" gutterBottom>
                CREATE PROMOTION
              </Typography>
    
              <form onSubmit={handleSubmit}>
              <TextField
      label="Point"
      variant="outlined"
      type="number"
      fullWidth
      margin="normal"
      value={point}
      onChange={(e) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue) && newValue >= 0) {
          setPoint(newValue);
        }
      }}
    />

    <TextField
      label="DiscountPercentage"
      variant="outlined"
      type="number"
      fullWidth
      margin="normal"
      value={discountPercentage}
      onChange={(e) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
          setDiscountPercentage(newValue);
        }
      }}
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
        <ToastContainer />
      </>
    );
  }