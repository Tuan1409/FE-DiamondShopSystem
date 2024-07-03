import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Category.css';

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:7122/api/Product/GetProducts');
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          console.error('Lỗi khi lấy dữ liệu sản phẩm:', data.error);
        }
      } catch (error) {
        console.error('Lỗi kết nối đến API:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    const quantity = document.getElementById(`quantity-${productId}`).value || 1;

    if (!token) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      return;
    }

    try {
      const response = await fetch('https://localhost:7122/api/Cart/update-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
      } else {
        const errorData = await response.json();
        console.error('Lỗi khi thêm vào giỏ hàng:', errorData);
        alert('Thêm vào giỏ hàng thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi yêu cầu API:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="container-fluid categoryContainer">
      <div>
        <h1 className="categoryTitle">ALL PRODUCTS</h1>
      </div>
      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card">
              <Link to={`/products/${product.id}`}>
                <img src={product.images[0]} alt={product.name} className="card-img-top" />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id={`quantity-${product.id}`}
                    defaultValue="1"
                    min="1"
                    style={{ maxWidth: '50px' }}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}