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
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

export default function CreateAccount(props) {
  const [nameAccount, setNameAccount] = useState('');
  const [emailAccount, setEmailAccount] = useState('');
  const [genderAccount, setGenderAccount] = useState('');
  const [passwordAccount, setPasswordAccount] = useState('');
  const [addressAccount, setAddressAccount] = useState('');
  const [phoneAccount, setPhoneAccount] = useState('');
  const [roleAccount, setRoleAccount] = useState('');
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    clearForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append('name', nameAccount);
    formData.append('email', emailAccount);
    formData.append('address', addressAccount);
    formData.append('gender', genderAccount);
    formData.append('password', passwordAccount);
    formData.append('phoneNumber', phoneAccount);
    formData.append('roleId', roleAccount);

    try {
      const response = await fetch('https://localhost:7122/api/Account/CreateUser', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const responseData = await response.json();
      if (!response.ok) { // Kiểm tra response.ok trước
        throw new Error(responseData.message || 'Lỗi khi tạo tài khoản!');
      }

      // Kiểm tra trường success trong response
      if (responseData.success === false) { 
        throw new Error(responseData.message || 'Lỗi khi tạo tài khoản!');
      } else {
        // Tạo tài khoản thành công
        clearForm();
        setSnackbarMessage('Tạo tài khoản thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          handleClose();
        }, 500);
        props.onAccountCreated(); 
      }
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error);
      setSnackbarMessage(error.message || 'Lỗi khi tạo tài khoản!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleClear = () => {
    clearForm();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  function clearForm() {
    setNameAccount('');
    setEmailAccount('');
    setAddressAccount('');
    setGenderAccount('');
    setPasswordAccount('');
    setPhoneAccount('');
    setRoleAccount('');
  }

  function validateForm() {
    return (
      nameAccount &&
      emailAccount &&
      addressAccount &&
      genderAccount &&
      passwordAccount &&
      phoneAccount &&
      roleAccount
    );
  }
  function validateForm() {
    return (
      nameAccount &&
      emailAccount &&
      addressAccount &&
      genderAccount &&
      passwordAccount &&
      phoneAccount &&
      roleAccount
    );
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
            <h3 className="titleOfForm">CREATE Account</h3>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6">
                    <TextField
                      type="text"
                      value={emailAccount}
                      onChange={(e) => setEmailAccount(e.target.value)}
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      className="form-control"
                      required // Yêu cầu người dùng nhập
                    />
                  </div>
                  <div className="col-6">
                    <TextField
                      type="password"
                      value={passwordAccount}
                      onChange={(e) => setPasswordAccount(e.target.value)}
                      id="outlined-basic"
                      label="Password"
                      variant="outlined"
                      className="form-control"
                      required 
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-12">
                    <TextField
                      type="text"
                      value={nameAccount}
                      onChange={(e) => setNameAccount(e.target.value)}
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      className="form-control"
                      required 
                    />
                  </div>
                </div>{' '}
                <br />
                <div className="row">
                  <div className="col-4">
                    <FormControl fullWidth>
                      <InputLabel id="select-label">Gender</InputLabel>
                      <Select
                        labelId="select-label"
                        id="demo-simple-select"
                        variant="outlined"
                        label="Gender"
                        value={genderAccount}
                        onChange={(e) => setGenderAccount(e.target.value)}
                        className="form-control"
                        sx={{ padding: '0' }}
                        required 
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-4">
                    <TextField
                      type="text"
                      value={phoneAccount}
                      onChange={(e) => setPhoneAccount(e.target.value)}
                      id="outlined-basic"
                      label="Phone"
                      variant="outlined"
                      className="form-control"
                      required 
                    />
                  </div>
                  <div className="col-4">
                    <TextField
                      type="text"
                      value={addressAccount}
                      onChange={(e) => setAddressAccount(e.target.value)}
                      id="outlined-basic"
                      label="Address"
                      variant="outlined"
                      className="form-control"
                      required 
                    />
                  </div>
                </div>{' '}
                <br />
                <div className="row">
                  <div className="col-12">
                    <FormControl fullWidth>
                      <InputLabel id="select-label">Role</InputLabel>
                      <Select
                        labelId="select-label"
                        id="demo-simple-select"
                        variant="outlined"
                        label="Role"
                        value={roleAccount}
                        onChange={(e) => setRoleAccount(parseInt(e.target.value, 10))}
                        className="form-control"
                        sx={{ padding: '0' }}
                        required 
                      >
                        <MenuItem value={1}>Admin</MenuItem>
                        <MenuItem value={2}>Sale staff</MenuItem>
                        <MenuItem value={3}>Delivery staff</MenuItem>
                        <MenuItem value={4}>Customer</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
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
                    Create
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