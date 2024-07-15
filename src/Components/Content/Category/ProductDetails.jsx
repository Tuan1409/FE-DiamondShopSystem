import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './styles.css'; // Nhập file CSS 
import './Category.css';
export default function ProductDetails() {
  const { productId } = useParams();
  const [products, setProducts] = useState(null);
  const [product, setProduct] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  useEffect(() => {
    fetch('https://localhost:7122/api/Product/GetProducts')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error('Lỗi khi lấy dữ liệu sản phẩm:', data.error);
        }
      })
      .catch(error => console.error('Lỗi kết nối đến API:', error));
  }, []);
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


  const handleAddToCart = async (productId) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value) || 1;
  console.log(product.quantity);
    // Sử dụng product state để tìm sản phẩm
    if (!product || quantity > product.quantity) {
      toast.error('Số lượng sản phẩm không đủ!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    if (!token) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    try {
      const res = await fetch('https://localhost:7122/api/Cart/add-to-cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: [
            { productId: productId, quantity: quantity }
          ]
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Lỗi khi thêm vào giỏ hàng! Status: ${res.status}`);
      }

      const contentType = res.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') ? await res.json() : null;

      console.log('Đã thêm vào giỏ hàng:', data);
      toast.success('Đã thêm sản phẩm vào giỏ hàng!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Cập nhật số lượng sản phẩm sau khi thêm vào giỏ hàng
      setProduct(prevProduct => ({ ...prevProduct, quantity: prevProduct.quantity - quantity }));

    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng: ' + error.message);
    }
  };
  return (
    <div className="product-details">
<div className="product-image">
      <img src={product.images[0]} alt={product.name} />
    </div>
    <div className="product-info">
      <h2 className="product-title">{product.name}</h2>
      <p className="product-price">{product.price}VND</p>
      <p className="product-material">Chất liệu: {product.productType.material}</p>
      <p className="product-weight">Trọng lượng: {product.weight}</p>
    
      <p className="product-size">
  {product.category.size === 0
    ? `length = ${product.category.length}`
    : `Size: ${product.category.size}`}
</p>

<div className='d-flex justify-content-between align-items-center mt-2'>
                    <div className='input-group input-group-sm'>
                      <input
                        type='number'
                        className='form-control'
                        id={`quantity-${product.id}`}
                        defaultValue='1'
                        min='1'
                        max={product.quantity}
                      />
                      <span className="ml-2">Còn lại: {product.quantity}</span>
                    </div>
                    <button className='btn btn-primary btn-sm' onClick={() => handleAddToCart(product.id)}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
    </div>
  </div>
  );
}