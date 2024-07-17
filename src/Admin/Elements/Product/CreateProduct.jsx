
import React, { useState, useEffect } from 'react';
import { 
    Button, Modal, Box, TextField, 
    Select, InputLabel, MenuItem, 
    OutlinedInput, FormControl, Snackbar,
    Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import Autocomplete from '@mui/material/Autocomplete';
export default function CreateProduct(props) {
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState(''); 
    const [productTypeId, setProductTypeId] = useState('');
    const [weight, setWeight] = useState('');
    const [wage, setWage] = useState('');
    const [quantity, setQuantity] = useState('');
    const [primaryDiamonds, setPrimaryDiamonds] = useState([]); 
    const [subDiamonds, setSubDiamonds] = useState([]);
    const [productImages, setProductImages] = useState([]);

    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        // Reset form fields
        setName('');
        setCategoryId('');
        setProductTypeId('');
        setWeight('');
        setWage('');
        setQuantity('');
        setPrimaryDiamonds([]);
        setSubDiamonds([]);
        setProductImages([]);
    };
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://localhost:7122/api/Category/GetCategories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data);
                  
                } else {
                    console.error("Lỗi khi lấy dữ liệu danh mục");
                }
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };

        fetchCategories(); 
    }, []);
    const [diamonds, setDiamonds] = useState([]);
    const [openDiamondModal, setOpenDiamondModal] = useState(false);
  const [selectedDiamondType, setSelectedDiamondType] = useState(null); // Thêm dòng này

    useEffect(() => {
      const fetchDiamonds = async () => {
        try {
          const response = await fetch('https://localhost:7122/api/Diamond/GetDiamondList');
          if (response.ok) {
            const data = await response.json();
            setDiamonds(data.data);
            console.log(diamonds, typeof diamonds);
          } else {
            console.error("Lỗi khi lấy dữ liệu diamond");
          }
        } catch (error) {
          console.error("Lỗi:", error);
        }
      };
  
      fetchDiamonds();
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
          setSnackbarMessage('Vui lòng điền đầy đủ thông tin!');
          setOpenSnackbar(true);
          return;
          }
        const formData = new FormData();
        formData.append('Name', name); 
        formData.append('CategoryId', categoryId);
        formData.append('ProductTypeId', productTypeId);
        formData.append('Weight', weight);
        formData.append('Wage', wage); 
        formData.append('Quantity', quantity);

        // Handle diamond arrays - adjust based on your API requirements
        primaryDiamonds.forEach((diamond) => {
          formData.append('PrimaryDiamonds', diamond.id); 
        });
      
        // Truyền diamondId từ SubDiamonds
        subDiamonds.forEach((diamond) => {
          formData.append('SubDiamonds', diamond.id); 
        });
        
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        // Handle image uploads


        productImages.forEach((image, index) => {
            formData.append('ProductImages', image);
        });
        
        try {
            const response = await fetch('https://localhost:7122/api/Product/CreateProduct', { 
                method: 'POST',
                body: formData 
            });

            if (response.ok) {
                setSnackbarMessage('Product created successfully!');
                setOpenSnackbar(true);                
                setTimeout(handleClose, 1000); 
                window.location.reload(); 
            } else {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(errorData.message || 'Error creating product');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setSnackbarMessage(error.message);
            setOpenSnackbar(true);
        }
    };

    // Helper function to add diamond IDs to arrays
    const handleAddDiamond = (diamond) => { // Nhận cả object diamond
      if (selectedDiamondType === 'primary') {
        setPrimaryDiamonds([...primaryDiamonds, { id: diamond.id, name: diamond.name }]);
      } else if (selectedDiamondType === 'sub') {
        setSubDiamonds([...subDiamonds, { id: diamond.id, name: diamond.name }]);
      }
      handleCloseDiamondModal();
    };
    const handleOpenDiamondModal = (type) => {
      setSelectedDiamondType(type);
      setOpenDiamondModal(true);
    };
  
    const handleCloseDiamondModal = () => {
      setOpenDiamondModal(false);
    };
    // Function to handle image selection
    const handleImageChange = (event) => {
        setProductImages([...event.target.files]);
    };
    function validateForm() {
      return (
        name &&
        categoryId &&
        productTypeId &&
        weight &&
        wage &&
        quantity 
        
      );
    }
    return (
      <>
      
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" type="button" size="large" onClick={handleOpen}>
            Create Product
          </Button>
    
          <Modal open={open} onClose={handleClose}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 800,
              bgcolor: 'background.paper',
              border: '1px solid #000',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography variant="h6" component="h2" gutterBottom>
                CREATE PRODUCT
              </Typography>
    
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
   <FormControl fullWidth margin="normal">
  <InputLabel id="category-select-label">Category</InputLabel>
  <Select
    labelId="category-select-label"
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    required
  >
    {categories.map((category) => (
      <MenuItem key={category.id} value={category.id}>
        {category.name} {category.size === 0 ? `(length = ${category.length})` : `(size = ${category.size})`}
      </MenuItem>
    ))}
  </Select>
</FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="productType-select-label">Product Type</InputLabel>
                  <Select
                    labelId="productType-select-label"
                    value={productTypeId}
                    onChange={(e) => setProductTypeId(e.target.value)}
                    required
                  >
                    {/* Replace with your actual product type options */}
                    <MenuItem value="1">Gold</MenuItem>
                    <MenuItem value="2">Platium</MenuItem>
                    <MenuItem calue="3">Sliver</MenuItem>
                  </Select>
                </FormControl>
    
                <TextField
                  label="Weight"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  inputProps={{ min: 0, step: "any" }}
                />
    
                <TextField
                  label="Wage"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  required
                  inputProps={{ min: 0, step: "any" }}
                />
    
                <TextField
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  inputProps={{ min: 0 }}
                />
    
                {/* Primary Diamonds */}
                <Autocomplete
                  multiple
                  id="primary-diamonds-select"
                  options={diamonds}
                  getOptionLabel={(diamond) => diamond.name}
                  value={primaryDiamonds}
                  onChange={(event, newValues) => {
                    setPrimaryDiamonds(newValues);
                  }}
                  required
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Primary Diamonds"
                      placeholder="Select primary diamonds"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />



            {/* Sub Diamonds */}
            <Autocomplete
                  multiple
                  id="sub-diamonds-select"
                  options={diamonds}
                  getOptionLabel={(diamond) => diamond.name}
                  value={subDiamonds}
                  onChange={(event, newValues) => {
                    setSubDiamonds(newValues);
                  }}
                  required
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sub Diamonds"
                      placeholder="Select sub diamonds"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
                {/* Image Upload */}
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  required
                  sx={{ marginTop: '10px' }}
                />
    
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SendIcon />}
                    sx={{ mr: 2 }}
                  >
                    Create
                  </Button>
    
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                    startIcon={<CancelScheduleSendIcon />}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
              <Modal open={openDiamondModal} onClose={handleCloseDiamondModal}>
              <Box sx={{ /* ... */ }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Select Diamond
                </Typography>
                {diamonds.map((diamond) => (
                  <Button
                    key={diamond.id}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    onClick={() => handleAddDiamond(diamond)}
                  >
                    {diamond.name} - {/* Hiển thị thông tin diamond */}
                  </Button>
                ))}
              </Box>
            </Modal>
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