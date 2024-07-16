import React, { useState, useEffect } from 'react'
import { Button, Modal, Box, TextField, Select, InputLabel, MenuItem, styled, FormControl,Snackbar,Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend'
import { amber } from '@mui/material/colors'
import UpdateIcon from '@mui/icons-material/Update'

export default function UpdateAccount({ onClick, ...props }) {
	const [idAccount, setIdAccount] = useState('')
	const [nameAccount, setnameAccount] = useState('')
	const [emailAccount, setEmailAccount] = useState('')
	const [genderAccount, setGenderAccount] = useState(null)
	const [phoneAccount, setPhoneAccount] = useState('')
	const [addressAccount, setAddressAccount] = useState('')
	const [passwordAccount, setPasswordAccount] = useState('') // Thêm trạng thái password
	const [roleIdAccount, setRoleIdAccount] = useState(null) // Thêm trạng thái roleId
	const [pointAccount, setPointAccount] = useState('') // Thêm trạng thái point
	const [data, setData] = useState(null)
	const [open, setOpen] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false); // Trạng thái cho Snackbar

	const handleOpen = () => {
		setOpen(true)
		// Cập nhật giá trị ban đầu cho các trạng thái
		setIdAccount(props.id || '')
		setnameAccount(props.name || '')
		setEmailAccount(props.email || '')
		setGenderAccount(props.gender || null)
		setPhoneAccount(props.phone || '')
		setAddressAccount(props.address || '')
		setPasswordAccount(props.password || '') // Cập nhật password
		setRoleIdAccount(props.roleId || '') // Cập nhật roleId
		setPointAccount(props.point || '') // Cập nhật point
	}

	const handleClose = () => {
		setOpen(false)
		setIdAccount('')
		setnameAccount('')
		setEmailAccount('')
		setGenderAccount(null)
		setPhoneAccount('')
		setAddressAccount('')
		setPasswordAccount('') // Reset password
		setRoleIdAccount(null) // Reset roleId
		setPointAccount('') // Reset point
		setData(null)
	}

	const UpdateButton = styled(Button)(({ theme }) => ({
		color: theme.palette.getContrastText(amber[500]),
		backgroundColor: amber[500],
		'&:hover': {
			backgroundColor: amber[700],
		},
	}))
	function getRoleValue(roleName) {
		switch (roleName) {
		  case 'Admin':
			return 1;
		  case 'Sale Staff':
			return 2;
		  case 'Delivery Staff':
			return 3;
		  case 'Customer':
			return 4;
		  default:
			return null; // Or handle the case of an unknown role
		}
	  }
	const handleSubmit = (event) => {
		event.preventDefault()
		// Gọi hàm CreateCaratWeight, truyền weight và price như là các đối số
		updateAccount(idAccount, emailAccount, nameAccount, genderAccount, phoneAccount, addressAccount, passwordAccount, roleIdAccount, pointAccount)
	}

	const handleClear = () => {
		setIdAccount('')
		setnameAccount('')
		setEmailAccount('')
		setGenderAccount(null)
		setPhoneAccount('')
		setAddressAccount('')
		setPasswordAccount('') // Reset password
		setRoleIdAccount(null) // Reset roleId
		setPointAccount('') // Reset point
		setData(null)
	}
	console.log(props.orderId)
	async function updateAccount(Id, Email, Name, Gender, Phone, Address, Password, RoleId, Point) {
		const url = `https://localhost:7122/api/Account/UpdateAccount/${Id}`;
	     const token = localStorage.getItem("token");
		const formData = new FormData();
		
		formData.append('Name', Name); // Chú ý tên trường
		formData.append('Email', Email);
		formData.append('Password', Password);
		formData.append('Address', Address);
		formData.append('PhoneNumber', Phone);
		formData.append('Gender', Gender); // Gửi "Male" hoặc "Female"
		formData.append('RoleId', RoleId);
		formData.append('Point', Point);
	
		try {
		  const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}` ,// Thêm header Authorization
				//'Content-Type': 'application/json' // Loại bỏ Content-Type khi sử dụng FormData
			},
			body: formData,
		  });
	
		  if (!response.ok) {
			const errorData = await response.json(); // Lấy thông tin lỗi từ server
			throw new Error(`HTTP error! status: ${response.status}`);
		  }
	
		  // Xử lý kết quả (nếu cần)
		  // Ví dụ: const data = await response.json();
	
		  props.onAccountUpdated(); 
		  handleClose();
		  setOpenSnackbar(true);
		} catch (error) {
		  console.error('Error updating account:', error);
		  // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
		}
	  }
	
    const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackbar(false);
	};
	useEffect(() => {
		setIdAccount(props.id)
	}, [props.id])

	useEffect(() => {
		setEmailAccount(props.email)
	}, [props.email])

	useEffect(() => {
		setnameAccount(props.name)
	}, [props.name])

	useEffect(() => {
		setGenderAccount(props.gender); // Set directly
	}, [props.gender]);

	useEffect(() => {
		setPhoneAccount(props.phone)
	}, [props.phone])

	useEffect(() => {
		setAddressAccount(props.address)
	}, [props.address])

	useEffect(() => {
		setPasswordAccount(props.password) // Cập nhật password
	}, [props.password])

	useEffect(() => {
		setRoleIdAccount(props.roleId); 
	}, [props.roleId]);

	useEffect(() => {
		setPointAccount(parseInt(props.point, 10)); // Parse as integer
	}, [props.point]);

	// Các hàm xử lý thay đổi
	const handleEmailChange = (e) => {
		setEmailAccount(e.target.value)
	}

	const handleNameChange = (e) => {
		setnameAccount(e.target.value)
	}

	const handleGenderChange = (e) => {
		setGenderAccount(e.target.value)
	}

	const handlePhoneChange = (e) => {
		setPhoneAccount(e.target.value)
	}

	const handleAddressChange = (e) => {
		setAddressAccount(e.target.value)
	}

	const handlePasswordChange = (e) => {
		setPasswordAccount(e.target.value) // Xử lý thay đổi password
	}

	const handleRoleIdChange = (e) => {
		setRoleIdAccount(e.target.value) // Xử lý thay đổi roleId
	}

	const handlePointChange = (e) => {
		setPointAccount(parseInt(e.target.value, 10)) // Xử lý thay đổi point
	}

	return (

        
		<div>
			<UpdateButton variant="contained" type="button" size="large"
				onClick={() => { handleOpen(); onClick() }}
				endIcon={<UpdateIcon></UpdateIcon>}>UPDATE</UpdateButton>
			<Modal open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					bgcolor: 'background.paper',
					border: '1px solid #000',
					boxShadow: 24,
					p: 4,
				}}>
					<h3 className='titleOfForm'>UPDATE Account</h3>
					<form onSubmit={handleSubmit}>
						<div className='row'>
							<div className='col-12'>
								<TextField disabled type="text" value={idAccount}
									id="outlined-basic" label="Id" variant="outlined" className='form-control' />
							</div>
						</div> <br />
						<div className='row'>
							<div className='col-6'>
								<TextField type="text" defaultValue={props.email} onChange={handleEmailChange}
									id="outlined-basic" label="Email" variant="outlined" className='form-control' />
							</div>
							<div className='col-6'>
								<TextField type="text" defaultValue={props.name} onChange={handleNameChange}
									id="outlined-basic" label="Name" variant="outlined" className='form-control' />
							</div>
						</div><br />
						<div className='row'>
							<div className='col-4'>
								<FormControl fullWidth>
									<InputLabel id="select-label">Gender</InputLabel>
									<Select 
									    labelId="select-label"
										id="demo-simple-select" variant="outlined"
										label="Gender" 
										defaultValue={props.gender} // Set the value directly									
										onChange={handleGenderChange} className='form-control'
										sx={{
											padding: '0'
										}}>
										  <MenuItem value="Male">Male</MenuItem> 
										  <MenuItem value="Female">Female</MenuItem> 
									</Select>
								</FormControl>
							</div>
							<div className='col-4'>
								<TextField type="text" defaultValue={props.phone} onChange={handlePhoneChange}
									id="outlined-basic" label="Phone" variant="outlined" className='form-control' />
							</div>
							<div className='col-4'>
								<TextField type="text" defaultValue={props.address} onChange={handleAddressChange}
									id="outlined-basic" label="Address" variant="outlined" className='form-control' />
							</div>
						</div> <br />
						<div className='row'>
							<div className='col-4'>
								<TextField type="password" defaultValue={props.password} onChange={handlePasswordChange}
									id="outlined-basic" label="Password" variant="outlined" className='form-control' />
							</div>
							<div className='col-4'>
								<FormControl fullWidth>
									<InputLabel id="select-label">Role</InputLabel>
									<Select labelId="select-label"
										id="demo-simple-select" variant="outlined"
										label="Role" 
										defaultValue={getRoleValue(props.roleId)} 
										onChange={handleRoleIdChange} className='form-control'
										sx={{
											padding: '0'
										}}>
										<MenuItem value={1}>Admin</MenuItem>
										<MenuItem value={2}>Sale Staff</MenuItem>
										<MenuItem value={3}>Delivery Staff</MenuItem>
										<MenuItem value={4}>Customer</MenuItem>
									</Select>
								</FormControl>
							</div>
							<div className='col-4'>
								<TextField type="number" 
								defaultValue={props.point} 
								onChange={handlePointChange}
									id="outlined-basic" label="Point" variant="outlined" className='form-control' />
							</div>
						</div> <br />
						<div className='formSubmit' >
							<Button
								type="submit"
								className='submitButton'
								value="Submit" variant="contained"
								size="large" endIcon={<SendIcon />}
								sx={{
									margin: '5px',
								}}>
								Send
							</Button>
							<Button type="button"
								value="Clear" onClick={handleClear}
								className='submitButton'
								variant="contained" size="large" color="error"
								endIcon={<CancelScheduleSendIcon />}
								sx={{
									margin: '5px',
								}}>
								Clear
							</Button>
						</div>
					</form>
				</Box>
			</Modal>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
    <Alert onClose={handleCloseSnackbar} severity="success">
        Update account successfully!
    </Alert>
</Snackbar>
		</div>
	)
}