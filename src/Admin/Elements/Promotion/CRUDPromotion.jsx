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
  Snackbar // Import Snackbar
} from '@mui/material';
import CreatePromotion from './CreatePromotion';
import DeleteIcon from '@mui/icons-material/Delete'; 
import UpdatePromotion from './UpdatePromotion'; 

export default function ReadPromotion() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPromotion, setSelectedPromotion] = useState(null); 
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleUpdate = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenUpdateModal(true); 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchPromotions = async () => {
        const token = localStorage.getItem("token");
      setIsLoading(true);
      try {
        const response = await fetch('https://localhost:7122/api/Promotion/GetPromotionList', {
            headers: {
              'Authorization': `Bearer ${token}` // Thêm header Authorization
            }
          });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPromotions(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [openUpdateModal]);

  const handleDeletePromotion = async (promotionId) => {
    try {
      const response = await fetch(`https://localhost:7122/api/Promotion/DeletePromotion/${promotionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Xóa promotion thành công, cập nhật lại danh sách promotion
        setPromotions(promotions.filter((promotion) => promotion.id !== promotionId));
        setSnackbarOpen(true);
        setTimeout(() => {
          window.location.reload();
        }, 100); 
      } else {
        console.error('Error deleting promotion:', response.status);
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedPromotion(null);
  };

  return (
    <div className='formCRUDContainer'>
      {isLoading ? ( 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        
      ) : (
        <> 
          {/* Kiểm tra promotions là mảng và có dữ liệu */}
          {Array.isArray(promotions) && promotions.length > 0 ? ( 
            <>
            <TableCell><CreatePromotion onAccountCreated={() => setTriggerRead(prev => !prev)}></CreatePromotion></TableCell>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Point</TableCell>
                      <TableCell>DiscountPercent</TableCell>
                      <TableCell>StartDate</TableCell>
                      
                      <TableCell>chức năng</TableCell> 
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promotions
                      .slice(
                        page * rowsPerPage,
                        Math.min((page * rowsPerPage) + rowsPerPage, promotions.length)
                      )
                      .map((promotion) => (
                        <TableRow key={promotion.id}>
                          <TableCell>{promotion.point}</TableCell>
                          <TableCell>{promotion.discountPercentage}%</TableCell>
                    
                          <TableCell>
                            {promotion.status ? 'Hoạt động' : 'Ngừng hoạt động'} 
                          </TableCell> 
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeletePromotion(promotion.id)}
                            >
                              Delete
                            </Button>
                            {/* Update button */}
                            <Button variant="outlined" color="warning" size="large" onClick={() => handleUpdate(promotion)}>
                              Update
                            </Button>
                            {/* UpdatePromotion modal */}
                            <UpdatePromotion
                              open={!!selectedPromotion && selectedPromotion.id === promotion.id}
                              onClose={handleCloseUpdateModal}
                              promotion={selectedPromotion}
                              onPromotionUpdated={() => {
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
                count={promotions.length}
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
            <p>Không có promotion nào.</p> 
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000} 
            onClose={handleCloseSnackbar}
            message="Xóa promotion thành công!"
          />
        </>
      )}
    </div>
  );
}