import React, { useState, useEffect } from 'react';
import { TextField, Button, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import UpdateIcon from '@mui/icons-material/Update';
import CreateCategory from './CreateCategory';
import DeleteIcon from '@mui/icons-material/Delete';
import { amber } from '@mui/material/colors';

const UpdateButton = styled(Button)(({ theme }) => ({
	color: theme.palette.getContrastText(amber[500]),
	backgroundColor: amber[500],
	'&:hover': {
		backgroundColor: amber[700],
	},
}));

export default function CRUDCategory() {
	const [categories, setCategories] = useState([]); // Use categories instead of data
	const [nameCategory, setnameCategory] = useState(null);
	const [size, setSize] = useState(null); // Thêm state cho Size
	const [length, setLength] = useState(null); // Thêm state cho Length
	const [showDelete, setShowDelete] = useState(false);
	const [selectedForDeletion, setSelectedForDeletion] = useState(null);
	const [selectedForUpdate, setSelectedForUpdate] = useState(null);
	const [showUpdate, setShowUpdate] = useState(true);
	const [triggerRead, setTriggerRead] = useState(false);

	function handleSubmitDelete(id) {
		if (id) {
			const url = 'https://localhost:7122/api/Category/DeleteCategory/' + id;

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

	function UpdateCategory(Id, Name, Size, Length, IsDeleted) {
		const url = 'https://localhost:7122/api/Category/UpdateCategory/' + Id;
		const Data = {
			"name": Name,
			"size": Size,
			"length": Length,
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
			const url = 'https://localhost:7122/api/Category/GetCategories';
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': '*/*'
				},
			})
				.then(response => response.json())
				.then(responseData => {
					setCategories(responseData.data); // Access the array using the key
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
		const categoryToUpdate = categories.find(c => c.id === id);
		if (categoryToUpdate) {
			setnameCategory(categoryToUpdate.name);
			setSize(categoryToUpdate.size);
			setLength(categoryToUpdate.length);
		}
	};

	function handleSubmitUpdate(id, name, size, length) {
		UpdateCategory(id, name, size, length, false); // Update IsDeleted to false
		setSelectedForUpdate(null);
		setnameCategory(null);
		setSize(null); // Xóa giá trị trong state size
		setLength(null); // Xóa giá trị trong state length
	}

	return (
		<>
			<div className='formCRUDContainer'>
				<div>
					{Array.isArray(categories) && categories ? (
						<table className='table table-striped table-bordered'>
							<thead>
								<tr>
									<th>Id</th>
									<th>Name</th>
									<th>Size</th>
									<th>Length</th>
									<th>Status</th>
									<th></th>
									<th><CreateCategory onCategoryCreated={() => setTriggerRead(prev => !prev)} /></th>
								</tr>
							</thead>
							<tbody>
								{
									categories.map((category, index) => (
										<tr key={category.id}>
											<td>{index + 1}</td>
											<td style={{
												maxWidth: '11vw',
												minWidth: '11vw'
											}}>
												{selectedForUpdate !== category.id && (category.name)}

												{selectedForUpdate === category.id && !showUpdate && (
													<>
														<form onSubmit={() => handleSubmitUpdate(category.id, nameCategory, size, length)}>
															<TextField disabled
																id="outlined-disabled"
																label="Id"
																defaultValue={category.id}
																sx={{
																	margin: '10px'
																}} />

															<TextField
																required
																defaultValue={category.name}
																onChange={(e) => setnameCategory(e.target.value)}
																id="outlined-basic"
																label="Name"
																variant="outlined"
																sx={{
																	margin: '10px'
																}}
															/> <br />


															<TextField
																type="number"
																label="Size"
																defaultValue={category.size}
																onChange={(e) => setSize(parseInt(e.target.value))} // Cập nhật state size
																sx={{
																	margin: '10px'
																}}
															/> <br />

															<TextField
																type="number"
																label="Length"
																defaultValue={category.length}
																onChange={(e) => setLength(parseInt(e.target.value))} // Cập nhật state length
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
																Confirm
															</Button>
															<Button type="button"
																value="Clear" onClick={() => {
																	setShowUpdate(!showUpdate)
																	setnameCategory(null)
																	setSelectedForUpdate(null)
																}}
																variant="contained" size="large" color="error"
																endIcon={<CancelIcon />}
																sx={{
																	margin: '5px',
																}}>
																Cancel
															</Button>
														</form>

													</>

												)}
											</td>
											<td style={{
												maxWidth: '11vw',
												minWidth: '11vw'
											}}>
												{category.size}
											</td>
											<td style={{
												maxWidth: '11vw',
												minWidth: '11vw'
											}}>
												{category.length}
											</td>
											<td style={{
												maxWidth: '11vw',
												minWidth: '11vw'
											}}>
												{category.isDeleted ? 'Đã huy' : 'Đang sử dụng'}
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
													}} onClick={() => handleDelete(category.id)}>
													DELETE
												</Button>

												{selectedForDeletion === category.id && showDelete && (
													<div>
														<Button
															type="submit"
															value="Submit" variant="contained" color="success"
															size="large" endIcon={<SendIcon />}
															sx={{
																margin: '5px',
															}}
															onClick={() => {
																handleSubmitDelete(category.id)
																handleDelete(category.id)
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
											</td>
											<td>
												<UpdateButton onClick={() => handleUpdate(category.id)}
													variant="contained" size="large"
													endIcon={<UpdateIcon />}
													sx={{
														margin: '5px',
														backgroundColor: '#ffc107'
													}}>
													Update
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
								Loading...
							</h3>
						</div>)
					}
				</div>
			</div >
		</>
	);
}