CRUDDiamond.jsx
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    Button,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    Grid,
    Typography,
    Select,
    MenuItem,
	ImageListItem,
  ImageListItemBar,
  ImageList
} from '@mui/material';
import CreateDiamond from './CreateDiamond';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateDiamond from './UpdateDiamond'; 

export default function CRUDDiamond() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [diamonds, setDiamonds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDiamond, setSelectedDiamond] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const handleUpdate = (diamond) => {
        setSelectedDiamond(diamond);
        setOpenUpdateModal(true);
    };
    const handleCloseUpdateModal = () => {
        setSelectedDiamond(null);
        setOpenUpdateModal(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const fetchDiamonds = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://localhost:7122/api/Diamond/GetDiamondList');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setDiamonds(data.data);
                console.log(diamonds);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiamonds();
    }, [openUpdateModal]); 

    const handleDeleteDiamond = async (diamondId) => {
		const token = localStorage.getItem('token'); 
        try {
            const response = await fetch(`https://localhost:7122/api/Diamond/DeleteDiamond/${diamondId}`, {
				method: 'DELETE',
				headers: {
				  'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
				}
			  });

            if (response.ok) {
                setDiamonds(diamonds.filter((diamond) => diamond.id !== diamondId));
                setSnackbarOpen(true);
                setTimeout(() => {
                    window.location.reload();
                }, 100); 
            } else {
                console.error('Error deleting diamond:', response.status);
            }
        } catch (error) {
            console.error('Error deleting diamond:', error);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div className='formCRUDContainer'>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>

            ) : (
                <>
                    <TableCell><CreateDiamond onAccountCreated={() => setTriggerRead(prev => !prev)}></CreateDiamond></TableCell>
                    {Array.isArray(diamonds) && diamonds.length > 0 ? (
                        <>

                            <TableContainer>
                                <Table stickyHeader>

                                    <TableHead>

                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Carat Weight</TableCell>
                                            <TableCell>Cut</TableCell>
                                            <TableCell>Color</TableCell>
                                            <TableCell>Clarity</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Origin</TableCell>
											<TableCell>image</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>

                                    </TableHead>
                                    <TableBody>
                                        {diamonds
                                            .slice(
                                                page * rowsPerPage,
                                                Math.min((page * rowsPerPage) + rowsPerPage, diamonds.length)
                                            )
                                            .map((diamond) => (
                                                <TableRow key={diamond.id}>
                                                    <TableCell>{diamond.name}</TableCell>
                                                    <TableCell>{diamond.caratWeight}</TableCell>
                                                    <TableCell>{diamond.cutName}</TableCell>
                                                    <TableCell>{diamond.color}</TableCell>
                                                    <TableCell>{diamond.clarityName}</TableCell>
                                                    <TableCell>{diamond.price.toLocaleString()}</TableCell> {/* Format giá tiền */}
                                                    <TableCell>{diamond.quantity}</TableCell>
                                                    <TableCell>{diamond.originName}</TableCell>
													<TableCell>
                            {diamond.images && diamond.images.length > 0 ? (
                                <ImageList sx={{ width: 200, height: 150 }} cols={2}>
                                    {diamond.images.map((image, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                src={`${image.urlPath}?w=164&h=164&fit=crop&auto=format`}
                                                srcSet={`${image.urlPath}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                alt={diamond.name}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            ) : (
                                <p>Không có hình ảnh</p>
                            )}
                        </TableCell>

                                                    <TableCell>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => handleDeleteDiamond(diamond.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                        <Button variant="outlined" color="warning" size="large" onClick={() => handleUpdate(diamond)}>
                                                            Update
                                                        </Button>

                                                        <UpdateDiamond
                                                            open={openUpdateModal && selectedDiamond && selectedDiamond.id === diamond.id} 
                                                            onClose={handleCloseUpdateModal}
                                                            diamond={selectedDiamond} 
                                                            onDiamondUpdated={() => {
                                                                handleCloseUpdateModal();
                                                            }}
                                                        />
                                                    </TableCell>

                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={diamonds.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            />
                        </>
                    ) : (
                        <p>Không có kim cương nào.</p>
                    )}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        message="Xóa kim cương thành công!"
                    />
                </>
            )}
        </div>
    );
}