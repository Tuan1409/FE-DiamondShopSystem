import React, { useState, useEffect } from 'react';
import { swiffyslider } from 'swiffy-slider';
import "swiffy-slider/css"
import './Category.css'; // Có thể tái sử dụng CSS từ Category

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch dữ liệu từ API khi component được mount
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

  // Khởi tạo swiffy-slider sau khi component được render
  useEffect(() => {
    window.swiffyslider = swiffyslider;
    window.swiffyslider.init();
  }, [products]); // Khởi tạo lại khi products thay đổi

  return (
    <div className='container-fluid categoryContainer'>
      <div>
        <h1 className='categoryTitle'>ALL PRODUCTS</h1>
      </div>
      <div className='swiffy-slider slider-item-show4 slider-nav-page slider-nav-autoplay slider-nav-autopause slider-nav-dark slider-item-show2-sm' id='centered'>
        <ul className='slider-container productContainer' id='productContainerId'>
          {products.map(product => (
            <li key={product.id}>
              <a href=''>
                <div className='card border-0'>
                  <div className='ratio ratio-1x1'>
                    {/* Hiển thị ảnh đầu tiên từ mảng images */}
                    <img src={product.images[0]} alt={product.name} className='imgListProduct' /> 
                  </div>
                  <div className='card-body p-0 pt-2'>
                  <div className='d-flex' id='textContainer'>
  <h3 style={{ wordBreak: 'break-all' }}>{product.name}</h3> 
</div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <button type='button' className='slider-nav' aria-label='Go left'></button>
        <button type='button' className='slider-nav slider-nav-next' aria-label='Go left'></button>
      </div>
    </div>
  );
}