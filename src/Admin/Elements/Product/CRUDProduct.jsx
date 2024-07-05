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
} from '@mui/material';
import CreateProduct from './CreateProduct';

export default function ReadProduct() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://localhost:7122/api/Product/GetProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setProducts(data.data); 
        console.log(products);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); 



  return (
    <div className='formCRUDContainer'>
      {isLoading ? ( 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
        
      ) : (
        <> 
               <TableCell><CreateProduct onAccountCreated={() => setTriggerRead(prev => !prev)}></CreateProduct></TableCell>
          {/* Kiểm tra products là mảng và có dữ liệu */}
          {Array.isArray(products) && products.length > 0 ? ( 
            <>
            
              <TableContainer>
                <Table stickyHeader>
         
                  <TableHead>
                    
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Images</TableCell>
                    </TableRow>
                    
                  </TableHead>
                  <TableBody>
                    {products
                      .slice(
                        page * rowsPerPage,
                        Math.min((page * rowsPerPage) + rowsPerPage, products.length)
                      )
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {product.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={product.name}
                                style={{ maxWidth: '100px' }}
                              />
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={products.length}
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
            <p>Không có sản phẩm nào.</p> 
          )}
        </>
      )}
    </div>
  );
}