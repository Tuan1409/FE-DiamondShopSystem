import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css'; // Nhập file CSS 
export default function ProductDetails() {
    const { productId } = useParams();
    console.log("productiddd"+productId)
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:7122/api/Product/GetProductById/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
        } else {
          console.error('Lỗi khi lấy dữ liệu sản phẩm:', data.error);
        }
      })
      .catch(error => console.error('Lỗi kết nối đến API:', error));
  }, [productId]);

  if (!product) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="product-details">
    <div className="product-image">
      <img src={product.images[0]} alt={product.name} />
    </div>
    <div className="product-info">
      <h2 className="product-title">{product.name}</h2>
      <p className="product-price">{product.price}</p>
      <p className="product-material">Chất liệu: {product.productType.material}</p>
      <p className="product-weight">Trọng lượng: {product.weight}</p>
      <p className="product-description">{product.description}</p>
      <p className="product-size">Size: {product.category.size}</p>
      <p className="product-quantity">Số lượng: {product.quantity}</p>

      {/* ... Các thông tin khác ... */}

      {/* Nút thêm vào giỏ hàng */}
      <button className="add-to-cart">Thêm vào giỏ hàng</button>
    </div>
  </div>
  );
}