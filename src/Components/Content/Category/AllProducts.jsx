import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Category.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();
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

  const handleAddToCart = async (productId) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value) || 1;

    const product = products.find(p => p.id === productId);
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
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, quantity: p.quantity - quantity } : p
        )
      );

    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng: ' + error.message);
    }
  };

  return (
    <div className="diamond-shop-container">
      <h1>ALL PRODUCTS</h1>
  
      <div className="diamond-grid productContainer">
        {products.map((product) => (
          <div key={product.id} className="diamond-card col-md-3 col-sm-6 mb-4">
            <Link to={`/product/${product.id}`} className="text-decoration-none">
              <div className="ratio ratio-1x1">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="diamond-image imgListProduct" 
                />
              </div>
            </Link>
            <div className="diamond-info card-body p-0 pt-2">
              <h3 className="card-title" style={{ wordBreak: 'break-all' }}>
                {product.name}
              </h3>
              <h5 className="card-text" style={{ wordBreak: 'break-all' }}>
                Chất liệu: {product.productType.material}
              </h5>
              <p className="product-size">
                {product.category.size === 0
                  ? `Chiều dài: ${product.category.length}`
                  : `Size: ${product.category.size}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
