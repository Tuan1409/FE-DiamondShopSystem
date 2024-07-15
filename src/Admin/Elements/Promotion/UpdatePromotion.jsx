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
import { amber } from '@mui/material/colors';
import UpdateIcon from '@mui/icons-material/Update';

export default function UpdatePromotion({ open, onClose, promotion, onPromotionUpdated }) {
  const [name, setName] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState(false); 
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Cập nhật state khi promotion thay đổi
    if (promotion) {
      setName(promotion.name);
      setDiscountPercent(promotion.discountPercent);
      setStartDate(new Date(promotion.startDate));
      setEndDate(new Date(promotion.endDate));
      setStatus(promotion.status); 
    }
  }, [promotion]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updatePromotion(
      promotion.id, // Sử dụng promotion.id
      name,
      discountPercent,
      startDate.toISOString(),
      endDate.toISOString(),
      status
    );
  };

  const handleClear = () => {
    setName('');
    setDiscountPercent(0);
    setStartDate(new Date());
    setEndDate(new Date());
    setStatus(false); 
  };

  async function updatePromotion(
    Id,
    Name,
    DiscountPercent,
    StartDate,
    EndDate,
    Status
  ) {
    const url = `https://localhost:7122/api/Promotion/UpdatePromotion/${Id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name,
          DiscountPercent,
          StartDate,
          EndDate,
          Status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
        
      }

      onPromotionUpdated(); // Gọi hàm callback từ component cha
      onClose(); // Đóng modal
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
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
          <h3 className="titleOfForm">UPDATE Promotion</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <TextField
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
                  label="Discount Percent"
                  variant="outlined"
                  className="form-control"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                  fullWidth
                  type="number" 
                />
              </div>
              <div className="col-6">
                <FormControl fullWidth>
                  <InputLabel id="select-status">Status</InputLabel>
                  <Select
                    labelId="select-status"
                    id="status"
                    variant="outlined"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-control"
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-6">
                <TextField
                  label="Start Date"
                  variant="outlined"
                  className="form-control"
                  type="date"
                  value={startDate.toISOString().split('T')[0]} 
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  fullWidth
                />
              </div>
              <div className="col-6">
                <TextField
                  label="End Date"
                  variant="outlined"
                  className="form-control"
                  type="date"
                  value={endDate.toISOString().split('T')[0]} 
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  fullWidth
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
                Send
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
          Update promotion successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}