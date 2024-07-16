import React, { useState, useEffect } from 'react';
import { TextField, Button, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import UpdateIcon from '@mui/icons-material/Update';
import CreateProductType from './CreateProductType'; // Import your CreateProductType component
import DeleteIcon from '@mui/icons-material/Delete';
import { amber } from '@mui/material/colors';

const UpdateButton = styled(Button)(({ theme }) => ({
	color: theme.palette.getContrastText(amber[500]),
	backgroundColor: amber[500],
	'&:hover': {
		backgroundColor: amber[700],
	},
}));

export default function CRUDProductType() {
	const [productTypes, setProductTypes] = useState([]); // Use productTypes instead of data
	const [nameProductType, setnameProductType] = useState(null);
	const [showDelete, setShowDelete] = useState(false);
	const [selectedForDeletion, setSelectedForDeletion] = useState(null);
	const [selectedForUpdate, setSelectedForUpdate] = useState(null);
	const [showUpdate, setShowUpdate] = useState(true);
	const [triggerRead, setTriggerRead] = useState(false);

	function handleSubmitDelete(id) {
		if (id) {
			const url = 'https://localhost:7122/api/ProductType/DeleteProductType/' + id;

			fetch(url, {
				method: 'DELETE',
				headers: {
					'Accept': '*/*'
				},
			})
				.then(responseData => {
					setTriggerRead(prev => !prev);
				})
				.catch((error) => console.error('Error:', error));
		}
	}

	function UpdateProductType(Id, Name, IsDeleted) {
		const url = 'https://localhost:7122/api/ProductType/UpdateProductType/' + Id;
		const Data = {
			"name": Name,
			"isDeleted": IsDeleted
		};
		fetch(url, {
			method: 'PUT',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Data)
		})
			.then(response => response.json())
			.then(responseData => {
				setShowUpdate(true);
				setTriggerRead(prev => !prev);
			})
			.catch((error) => console.error('Error:', error));
	}

	useEffect(() => {
		// Define the Read function inside useEffect or make sure it's defined outside and doesn't change
		function Read() {
			const url = 'https://localhost:7122/api/ProductType/GetProductTypes';
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': '*/*'
				},
			})
				.then(response => response.json())
				.then(responseData => {
					setProductTypes(responseData.data); // Access the array using the key
				})
				.catch((error) => console.error('Error:', error));
		}
		Read();
	}, [triggerRead]);

	const handleDelete = (id) => {
		setSelectedForDeletion(id);
		setShowDelete(true);
	};

	const handleUpdate = (id) => {
		setSelectedForUpdate(id);
		setShowUpdate(false);
		const productTypeToUpdate = productTypes.find(c => c.id === id);
		if (productTypeToUpdate) {
			setnameProductType(productTypeToUpdate.name);
		}
	};

	function handleSubmitUpdate(id, name) {
		UpdateProductType(id, name, false); // Update IsDeleted to false
		setSelectedForUpdate(null);
		setnameProductType(null);
	}

	return (
		<>
			<div className='formCRUDContainer'>
				<div>
					{Array.isArray(productTypes) && productTypes ? (
						<table className='table table-striped table-bordered'>
							<thead>
								<tr>
									<th>Id</th>
									<th>Tên</th>
									<th>Trạng thái</th>
									<th></th>
									<th><CreateProductType onProductTypeCreated={() => setTriggerRead(prev => !prev)} /></th>
								</tr>
							</thead>
							<tbody>
								{
									productTypes.map((productType, index) => (
										<tr key={productType.id}>
											<td>{index + 1}</td>
											<td style={{
												maxWidth: '11vw',
												minWidth: '11vw'
											}}>
												{selectedForUpdate !== productType.id && (productType.name)}

												{selectedForUpdate === productType.id && !showUpdate && (
													<>
														<form onSubmit={() => handleSubmitUpdate(productType.id, nameProductType)}>
															<TextField disabled
																id="outlined-disabled"
																label="Id"
																defaultValue={productType.id}
																sx={{
																	margin: '10px'
																}} />

															<TextField
																required
																defaultValue={productType.name}
																onChange={(e) => setnameProductType(e.target.value)}
																id="outlined-basic"
																label="Tên"
																variant="outlined"
																sx={{
																	margin: '10px'
																}}
															/> <br />

															<Button
																type="submit"
																value="Submit" variant="contained" color="success"
																size="large" endIcon={<SendIcon />}
																sx={{
																	margin: '5px',
																}}
															>
																Xác nhận
															</Button>
															<Button type="button"
																value="Clear" onClick={() => {
																	setShowUpdate(!showUpdate)
																	setnameProductType(null)
																	setSelectedForUpdate(null)
																}}
																variant="contained" size="large" color="error"
																endIcon={<CancelIcon />}
																sx={{
																	margin: '5px',
																}}>
																Hủy bỏ
															</Button>
														</form>

													</>

												)}
											</td>
											<td style={{
												maxWidth: '11vw',
												minWidth: '11vw'
											}}>
												{productType.isDeleted ? 'Đã hủy' : 'Đang sử dụng'}
											</td>
											<td style={{
												maxWidth: '11vw',
												minWidth: '11vw'
											}}>
												<Button variant="outlined" color="error"
													size="large" endIcon={<DeleteIcon />}
													sx={{
														margin: '5px',
														fontWeight: 'bold'
													}} onClick={() => handleDelete(productType.id)}>
													XÓA
												</Button>

												{selectedForDeletion === productType.id && showDelete && (
													<div>
														<Button
															type="submit"
															value="Submit" variant="contained" color="success"
															size="large" endIcon={<SendIcon />}
															sx={{
																margin: '5px',
															}}
															onClick={() => {
																handleSubmitDelete(productType.id)
																handleDelete(productType.id)
															}
															}>
															Xác nhận
														</Button>
														<Button type="button"
															value="Clear" onClick={() => setShowDelete(false)}
															variant="contained" size="large" color="error"
															endIcon={<CancelIcon />}
															sx={{
																margin: '5px',
															}}>
															Hủy bỏ
														</Button>
													</div>
												)}
											</td>
											<td>
												<UpdateButton onClick={() => handleUpdate(productType.id)}
													variant="contained" size="large"
													endIcon={<UpdateIcon />}
													sx={{
														margin: '5px',
														backgroundColor: '#ffc107'
													}}>
													Cập nhật
												</UpdateButton>
											</td>
										</tr>
									))
								}
							</tbody>
						</table>
					) : (
						<div>
							<h3>
								Đang tải...
							</h3>
						</div>)
					}
				</div>
			</div >
		</>
	);
}