import React, { useState, useEffect } from 'react';
import CreateAccount from './CreateAccount'
import ReadAccountByName from './ReadAccountByName'
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, styled, Modal, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import CancelIcon from '@mui/icons-material/Cancel'
import UpdateAccount from './UpdateAccount';

import { amber } from '@mui/material/colors'
export default function ReadAccount() {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [data, setData] = useState(null)
	const [triggerRead, setTriggerRead] = useState(false)
	const [selectedForDeletion, setSelectedForDeletion] = useState(null)
	const [showDelete, setShowDelete] = useState(false)
	const [selectedForUpdate, setSelectedForUpdate] = useState(null)
	const [deleteError, setDeleteError] = useState(null); // Thêm state để lưu lỗi (nếu có)
	const columns = [
		{ id: '#', label: '#', align: 'left', },
		{ id: 'Name', label: 'Name', align: 'left', },
		{ id: 'Email', label: 'Email', align: 'left', },
		{ id: 'Gender', label: 'Gender', align: 'left', },
		{ id: 'PhoneNumber', label: 'Phone number', align: 'left', },
		{ id: 'Address', label: 'Address', align: 'left', },
		{ id: 'Role', label: 'Role', align: 'left', },
		{ id: 'Point', label: 'Point', align: 'left', },
		{ id: 'Status', label: 'Status', align: 'left', },
	];


	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	function getRoleName(roleId) {
		switch (roleId) {
			case 1:
				return 'Admin'
			case 2:
				return 'Sale staff'
			case 3:
				return 'Delivery staff'
			case 4:
				return 'Customer'
		}
	}

	
	  useEffect(() => {
		async function Read() {
		  try {
			// Giả sử bạn có cách để lấy mã thông báo (ví dụ: từ bộ nhớ cục bộ)
		
			const token = localStorage.getItem("token");
			if (!token) {
			  console.error('Không tìm thấy mã thông báo xác thực.');
			  return; // Hoặc chuyển hướng đến trang đăng nhập
			}
	
			const url = 'https://localhost:7122/api/Account/GetAccountList';
			const response = await fetch(url, {
			  method: 'GET',
			  headers: {
				'Accept': '*/*',
				'Authorization': `Bearer ${token}` // Thêm mã thông báo bearer vào tiêu đề
			  },
			});
	
			if (!response.ok) {
			  throw new Error(`Lỗi HTTP! trạng thái: ${response.status}`); 
			}
	
			const responseData = await response.json();
	
			if (Array.isArray(responseData.data)) {
				const rows = responseData.data.map(data => ({
					id: data.id,
					name: data.name,
					email: data.email,
					gender: data.gender,
					address: data.address,
					phoneNumber: data.phoneNumber,
					point: data.point,
					roleId: getRoleName(data.roleId),
					isDeleted: data.isDeleted,
				  }));
				  setData(rows);
			 
			} else {
			  console.error("Lỗi: Phản hồi API không hợp lệ", responseData);
			  setData([]); 
			}
		  } catch (error) {
			console.error('Lỗi khi tìm nạp dữ liệu:', error);
		  }
		}
		Read();
	  }, [triggerRead]);

	const handleDelete = (id) => {
		setSelectedForDeletion(id)
		setShowDelete(true)
	}
	function handleSubmitDelete(idAccount) {
		console.log("aaaa"+idAccount);
		const token = localStorage.getItem("token");
		if (idAccount) {
			const url = `https://localhost:7122/api/Account/DeleteAccount/${idAccount}`;

			
			fetch(url, {
				method: 'DELETE',
				headers: {
					'Accept': '*/*',
					'Authorization': `Bearer ${token}` // Thêm mã thông báo bearer vào tiêu đề
			  
				},
			})
				.then(responseData => {
					setData(responseData)
					setTriggerRead(prev => !prev)
				})
		}
	}

	const handleUpdate = (id) => {
		setSelectedForUpdate(id)
	}

	return (
		<>
			<div className='formCRUDContainer'>
				<TableContainer >
					<Table stickyHeader >
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										sx={{
											fontWeight: 'bold',
											fontSize: '1.2em'
										}}
									>
										{column.label}
									</TableCell>
								))}
								<TableCell><ReadAccountByName></ReadAccountByName></TableCell>
								<TableCell><CreateAccount onAccountCreated={() => setTriggerRead(prev => !prev)}></CreateAccount></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Array.isArray(data) && data
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((data, index) => (
									<tr key={data.id}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>
											{data.name}
										</TableCell>
										<TableCell>
											{data.email}
										</TableCell>
										<TableCell>
											{data.gender}
										</TableCell>
										<TableCell>
											{data.phoneNumber}
										</TableCell>
										<TableCell>
											{data.address}
										</TableCell>
										<TableCell>
											{data.roleId}
										</TableCell>
										<TableCell>
											{data.point}
										</TableCell>
										<TableCell>{data.isDeleted ? 'Inactive' : 'Active'}</TableCell> {/* Hiển thị trạng thái */}
										<TableCell>
											<Button variant="outlined" color="error"
												size="large" endIcon={<DeleteIcon />}
												sx={{
													margin: '5px',
													fontWeight: 'bold'
												}} onClick={() => handleDelete(data.id)}>
												DELETE
											</Button>

											{selectedForDeletion === data.id && showDelete && (
												<div>
													<Button
														type="submit"
														value="Submit" variant="contained" color="success"
														size="large" endIcon={<SendIcon />}
														sx={{
															margin: '5px',
														}}
														onClick={() => {
															handleSubmitDelete(data.id)
															handleDelete(data.id)
														}
														}>
														Confirm
													</Button>
													<Button type="button"
														value="Clear" onClick={() => setShowDelete(false)}
														variant="contained" size="large" color="error"
														endIcon={<CancelIcon />}
														sx={{
															margin: '5px',
														}}>
														Cancel
													</Button>
												</div>
											)}
										</TableCell>
										<TableCell>
											<UpdateAccount id={selectedForUpdate}
												email={data.email}
												name={data.name}
												gender={data.gender}
												phone={data.phoneNumber}
												address={data.address}
												roleId={data.roleId}
												point={data.point}
												onClick={() => handleUpdate(data.id)}
												onAccountUpdated={() => setTriggerRead(prev => !prev)}></UpdateAccount>
										</TableCell>
									</tr>
								))}
						</TableBody>
					</Table>

				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 50]}
					component="div"
					count={Array.isArray(data) && (data.length)}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				/>
			</div>

		</>
	)
}
