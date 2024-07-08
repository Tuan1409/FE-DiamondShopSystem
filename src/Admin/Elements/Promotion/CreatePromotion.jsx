import React, { useState, useEffect } from 'react';
import { 
    Button, Modal, Box, TextField, 
    Select, InputLabel, MenuItem, 
    OutlinedInput, FormControl, Snackbar,
    Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

export default function CreatePromotion(props) {
    const [name, setName] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
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
        setName('');
        setDiscountPercent(0);
        setStartDate(new Date());
        setEndDate(new Date());
        setStatus(false); 
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://localhost:7122/api/Promotion/CreatePromotion', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: name, 
                    DiscountPercent: discountPercent,
                    StartDate: startDate.toISOString(), 
                    EndDate: endDate.toISOString(), 
                    Status: status
                })
            });

            if (response.ok) {
                setSnackbarMessage('Promotion created successfully!');
                setOpenSnackbar(true);
                props.onPromotionCreated(); 
                setTimeout(handleClose, 1000); 
            } else {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(errorData.ErrorMessage || 'Error creating promotion');
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
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
    
                <TextField
                  label="Discount Percent"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                />
    
                <TextField
                  label="Start Date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={startDate.toISOString().split('T')[0]} // Format date
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />

                <TextField
                  label="End Date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={endDate.toISOString().split('T')[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SendIcon />}
                    sx={{ mr: 2 }}
                  >
                    Submit
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