import React, { useState, useEffect } from 'react';
import { TextField, Button, styled, TablePagination } from '@mui/material';
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
	const [snackbarMessage, setSnackbarMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [nameCategory, setnameCategory] = useState(null);
  const [size, setSize] = useState(null);
  const [length, setLength] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);
  const [selectedForUpdate, setSelectedForUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(true);
  const [triggerRead, setTriggerRead] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7122/api/Category/GetCategories', {
          headers: {
            'Accept': '*/*'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
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

  const handleSubmitDelete = async (id) => {
    if (id) {
      const url = `https://localhost:7122/api/Category/DeleteCategory/${id}`;
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Accept': '*/*'
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Xóa danh mục thất bại');
        }
        setTriggerRead(prev => !prev);
        setDeleteError(null);
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        setDeleteError(error.message);
      }
    }
  };

  const UpdateCategory = async (Id, Name, Size, Length, IsDeleted) => {
    const url = `https://localhost:7122/api/Category/UpdateCategory/${Id}`;
    const data = {
      "name": Name,
      "size": Size,
      "length": Length,
      "isDeleted": IsDeleted
    };
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setShowUpdate(true);
      setTriggerRead(prev => !prev);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleSubmitUpdate = (id, name, size, length) => {
	if (!validateForm()) {
		setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
		setOpenSnackbar(true);
		return;
		}
    UpdateCategory(id, name, size, length, false);
    setSelectedForUpdate(null);
    setnameCategory(null);
    setSize(null);
    setLength(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function validateForm() {
    
    return (
      size &&
      length 
    );
  }
  return (
    <>
      <div className='formCRUDContainer'>
        <div>
          {Array.isArray(categories) && categories.length > 0 ? (
            <>
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
                  {categories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>
                          {selectedForUpdate !== category.id && (category.name)}

                          {selectedForUpdate === category.id && !showUpdate && (
                            <>
                              <form onSubmit={() => handleSubmitUpdate(category.id, nameCategory, size, length)}>
                                <TextField disabled
                                  id="outlined-disabled"
                                  label="Id"
                                  defaultValue={category.id}
                                  sx={{ margin: '10px' }}
                                />

                                <TextField
                                  required
                                  defaultValue={category.name}
                                  onChange={(e) => setnameCategory(e.target.value)}
                                  id="outlined-basic"
                                  label="Name"
                                  variant="outlined"
                                  sx={{ margin: '10px' }}
                                /> <br />

                                <TextField
								required
                                  type="number"
                                  label="Size"
                                  defaultValue={category.size}
                                  onChange={(e) => setSize(parseInt(e.target.value))}
                                  sx={{ margin: '10px' }}
								  inputProps={{ min: 0 }}
                                /> <br />

                                <TextField
								required
                                  type="number"
                                  label="Length"
                                  defaultValue={category.length}
                                  onChange={(e) => setLength(parseInt(e.target.value))}
                                  sx={{ margin: '10px' }}
								  inputProps={{ min: 0 }}
                                /> <br />

                                <Button
                                  type="submit"
                                  value="Submit" variant="contained" color="success"
                                  size="large" endIcon={<SendIcon />}
                                  sx={{ margin: '5px' }}
                                >
                                  Confirm
                                </Button>
                                <Button type="button"
                                  value="Clear"
                                  onClick={() => {
                                    setShowUpdate(!showUpdate);
                                    setnameCategory(null);
                                    setSelectedForUpdate(null);
                                  }}
                                  variant="contained" size="large" color="error"
                                  endIcon={<CancelIcon />}
                                  sx={{ margin: '5px' }}
                                >
                                  Cancel
                                </Button>
                              </form>
                            </>
                          )}
                        </td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>{category.size}</td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>{category.length}</td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>
                          {category.isDeleted ? 'Đã hủy' : 'Đang sử dụng'}
                        </td>
                        <td style={{ maxWidth: '11vw', minWidth: '11vw' }}>
                          <Button
                            variant="outlined"
                            color="error"
                            size="large"
                            endIcon={<DeleteIcon />}
                            sx={{ margin: '5px', fontWeight: 'bold' }}
                            onClick={() => handleDelete(category.id)}
                          >
                            DELETE
                          </Button>
                          {deleteError && selectedForDeletion === category.id && (
                            <div style={{ color: 'red' }}>{deleteError}</div>
                          )}

                          {selectedForDeletion === category.id && showDelete && (
                            <div>
                              <Button
                                type="submit"
                                value="Submit"
                                variant="contained"
                                color="success"
                                size="large"
                                endIcon={<SendIcon />}
                                sx={{ margin: '5px' }}
                                onClick={() => {
                                  handleSubmitDelete(category.id);
                                  handleDelete(category.id);
                                }}
                              >
                                Confirm
                              </Button>
                              <Button
                                type="button"
                                value="Clear"
                                onClick={() => setShowDelete(false)}
                                variant="contained"
                                size="large"
                                color="error"
                                endIcon={<CancelIcon />}
                                sx={{ margin: '5px' }}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </td>
                        <td>
                          <UpdateButton
                            onClick={() => handleUpdate(category.id)}
                            variant="contained"
                            size="large"
                            endIcon={<UpdateIcon />}
                            sx={{ margin: '5px', backgroundColor: '#ffc107' }}
                          >
                            Update
                          </UpdateButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={categories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <div>
              <h3>Loading...</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
}