import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import "./Login.css";
import { Button, Modal, Box, TextField, Select, InputLabel, MenuItem, styled, FormControl,Snackbar,Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend'
import { amber } from '@mui/material/colors'
import UpdateIcon from '@mui/icons-material/Update'

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [point, setPoint] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleOpen = () => {
    setOpen(true);
    setName(user.name);
    setEmail(user.email);
    setGender(user.gender);
    setPhone(user.phoneNumber);
    setAddress(user.address);
    setPassword(user.password); 
    setRoleId(user.roleId);
    setPoint(user.point);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const UpdateButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(amber[500]),
    backgroundColor: amber[500],
    '&:hover': {
      backgroundColor: amber[700],
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.Id;
        const response = await axios.get(`https://localhost:7122/api/Account/GetAccountById/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found!');
      return;
    }
    const userId = jwtDecode(token).Id;

    const formData = new FormData();
    formData.append('Name', name); 
    formData.append('Email', email);
    formData.append('Password', password); 
    formData.append('Address', address);
    formData.append('PhoneNumber', phone);
    formData.append('Gender', gender);
    formData.append('RoleId', roleId);
    formData.append('Point', point);

    try {
      const response = await fetch(`https://localhost:7122/api/Account/UpdateAccount/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Cập nhật thông tin thất bại');
      }

      const updatedUser = { ...user, name, email, gender, phoneNumber: phone, address, password, roleId, point };
      setUser(updatedUser);
      setSnackbarSeverity('success');
      setSnackbarMessage('Cập nhật thông tin thành công!');
      setOpenSnackbar(true);
      handleClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(error.message || 'Cập nhật thông tin thất bại!');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error.message}</div>;
  }
  function getRoleValue(roleId) {
    switch (roleId) {
      case 1:
        return 'Admin';
      case 2:
        return 'Sale Staff';
      case 3:
        return 'Delivery Staff';
      case 4:
        return 'Customer';
      default:
        return 'Unknown Role';
    }
  }
  return (
    <div className="pageLoginContainer profile-container">
      <div className="profile-container">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Thông tin cá nhân</h2>

        {/* <div className="profile-section">
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Email: {user.email}</p>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Tên: {user.name}</p>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Giới tính: {user.gender}</p>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Số điện thoại: {user.phoneNumber}</p>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Địa chỉ: {user.address}</p>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Vai trò: {getRoleValue(user.roleId)}</p> 
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>Điểm tích lũy: {user.point}</p>
        </div> */}
<form onSubmit={handleSubmit} className="profile-form">
  <div className="row">
    <div className="col-6">
      <TextField
        label="Email"
        variant="outlined"
        className="form-control"
        value={user.email}
        disabled // Vô hiệu hóa input email
        fullWidth
      />
    </div>
    <div className="col-6">
      <TextField
        label="Tên"
        variant="outlined"
        className="form-control"
        value={user.name}
        disabled // Vô hiệu hóa input name
        fullWidth
      />
    </div>
  </div>
  <br />
  <div className="row">
    <div className="col-4">
      <FormControl fullWidth>
        <InputLabel id="select-label">Giới tính</InputLabel>
        <Select
          labelId="select-label"
          id="demo-simple-select"
          variant="outlined"
          label="Giới tính"
          value={user.gender}
          disabled // Vô hiệu hóa select gender
          className="form-control"
          sx={{
            padding: '0',
          }}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
    </div>
    <div className="col-4">
      <TextField
        label="Số điện thoại"
        variant="outlined"
        className="form-control"
        value={user.phoneNumber}
        disabled // Vô hiệu hóa input phone
        fullWidth
      />
    </div>
    <div className="col-4">
      <TextField
        label="Địa chỉ"
        variant="outlined"
        className="form-control"
        value={user.address}
        disabled // Vô hiệu hóa input address
        fullWidth
      />
    </div>
  </div>
  <br />
  <div className="row">
    <div className="col-4">
      <TextField
        label="Vai trò"
        variant="outlined"
        className="form-control"
        value={getRoleValue(user.roleId)}
        disabled // Vô hiệu hóa input role
        fullWidth
      />
    </div>
    <div className="col-4">
      <TextField
        label="Điểm tích lũy"
        variant="outlined"
        className="form-control"
        value={user.point}
        disabled // Vô hiệu hóa input point
        fullWidth
      />
    </div>
  </div>
  <br />
  {/* Nút "Cập nhật" */}
  
</form>
        <UpdateButton variant="contained" type="button" size="large" onClick={handleOpen} endIcon={<UpdateIcon />}>
          Cập nhật
        </UpdateButton>
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
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
          <h3 className="titleOfForm">UPDATE Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <TextField
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  className="form-control"
                />
              </div>
              <div className="col-6">
                <TextField
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  className="form-control"
                />
              </div>
            </div>
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
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-control"
                    sx={{
                      padding: '0',
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-4">
                <TextField
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  id="outlined-basic"
                  label="Phone"
                  variant="outlined"
                  className="form-control"
                />
              </div>
              <div className="col-4">
                <TextField
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  id="outlined-basic"
                  label="Address"
                  variant="outlined"
                  className="form-control"
                />
              </div>
            </div>{' '}
            <br />
            <div className="row">
              <div className="col-4">
                <TextField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  className="form-control"
                />
              </div>
              <div className="col-4">
                <FormControl fullWidth>
                  <InputLabel id="select-label">Role</InputLabel>
                  <Select
                    labelId="select-label"
                    id="demo-simple-select"
                    variant="outlined"
                    label="Role"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)} 
                    className="form-control"
                    sx={{
                      padding: '0',
                    }}
                  >
                    <MenuItem value={1}>Admin</MenuItem>
                    <MenuItem value={2}>Sale Staff</MenuItem>
                    <MenuItem value={3}>Delivery Staff</MenuItem>
                    <MenuItem value={4}>Customer</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-4">
                <TextField
                  type="number"
                  value={point}
                  onChange={(e) => setPoint(parseInt(e.target.value, 10))} 
                  id="outlined-basic"
                  label="Point"
                  variant="outlined"
                  className="form-control"
                />
              </div>
            </div>{' '}
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
                Cập nhật
              </Button>
              <Button
                type="button"
                value="Clear"
                onClick={handleClose}
                className="submitButton"
                variant="contained"
                size="large"
                color="error"
                endIcon={<CancelScheduleSendIcon />}
                sx={{
                  margin: '5px',
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;