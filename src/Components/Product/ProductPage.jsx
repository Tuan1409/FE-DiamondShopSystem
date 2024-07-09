import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:7122/api/Product/GetProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setProducts(data.data || []); 
      } catch (error) {
        console.error('Error fetching the product list:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = (product) => { 
    navigate(`/product-detail/${product.id}`, { state: { product } }); 
  };

  return (
    <div className="product-shop-container">
      <h1>The Products</h1>
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card" onClick={() => handleClick(product)}>
            <img
              className="product-image"
              src={product.images && product.images[0] ? product.images[0].urlPath : '/path/to/default/image.jpg'}
              alt={product.name}
            />
            <div className="product-content">
              <h2>{product.name}</h2>
              <h3>{product.price.toLocaleString()} VND</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
