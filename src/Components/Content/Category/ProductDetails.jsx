import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS của react-toastify
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

  if (!product) {
    return <div>Đang tải...</div>;
  }
  const handleAddToCart = async (productId) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value) || 1;
  console.log(product.quantity);
    // Sử dụng product state để tìm sản phẩm
    if (!product || quantity > product.quantity) {
      toast.error('Số lượng không đủ : '  ,{
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
      toast.error('Vui lòng đăng nhập để mua hàng!', {
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
      toast.error('Vui lòng đăng nhập để mua hàng!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });;
    }
  };
  return (
    <div className="product-details">
      <div className="product-image">
        <img src={product.images[0]} alt={product.name} />
      </div>
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>
        <p className="product-price">{product.price.toLocaleString()}VND</p>
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
    

      {/* Hiển thị đoạn code HTML cho hướng dẫn đo size nhẫn */}
      <div className="container">
        <h1>Hướng dẫn đo size kích cỡ nhẫn</h1>
        <div className="image-container">
         
        </div>
        <div className="content">
            <p>Để chọn size nhẫn phù hợp, bạn cần đo chu vi ngón tay của mình. Dưới đây là 2 cách đo size nhẫn phổ biến:</p>
            <ul>
                <li><strong>Cách 1: Dùng dây đo chu vi ngón tay</strong></li>
                <p>Sử dụng dây đo, đo chu vi ngón tay mà bạn muốn đeo nhẫn.</p>
                <p>Sau khi đo, bạn có thể đổi sang kích cỡ nhẫn tương ứng với chu vi ngón tay.</p>
                <li><strong>Cách 2: Dùng giấy đo chu vi ngón tay</strong></li>
                <p>Cắt một dải giấy có chiều rộng khoảng 1cm, sau đó quấn quanh ngón tay của bạn.</p>
                <p>Dùng bút chì đánh dấu vị trí giấy giao nhau.</p>
                <p>Dùng thước đo khoảng cách giữa hai điểm đánh dấu, đó là chu vi ngón tay.</p>
                <p>Sau khi đo, bạn có thể đổi sang kích cỡ nhẫn tương ứng với chu vi ngón tay.</p>
            </ul>
            <p>Lưu ý:</p>
            <ul>
                <li>Bạn nên đo chu vi ngón tay khi ngón tay đang ở trạng thái bình thường, không quá nóng hoặc lạnh.</li>
                <li>Nên đo chu vi ngón tay vào buổi chiều, lúc ngón tay đang to nhất.</li>
                <li>Nếu bạn có ngón tay to hơn bình thường, hãy chọn size nhẫn lớn hơn.</li>
                <li>Nếu bạn có ngón tay nhỏ hơn bình thường, hãy chọn size nhẫn nhỏ hơn.</li>
            </ul>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Chu vi ngón tay (mm)</th>
                            <th>Size nhẫn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>45 - 47</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>47 - 49</td>
                            <td>6</td>
                        </tr>
                        <tr>
                            <td>49 - 52</td>
                            <td>7</td>
                        </tr>
                        <tr>
                            <td>52 - 54</td>
                            <td>8</td>
                        </tr>
                        <tr>
                            <td>54 - 56</td>
                            <td>9</td>
                        </tr>
                        <tr>
                            <td>56 - 58</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>58 - 60</td>
                            <td>11</td>
                        </tr>
                        <tr>
                            <td>60 - 62</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>62 - 65</td>
                            <td>13</td>
                        </tr>
                        <tr>
                            <td>65 - 67</td>
                            <td>14</td>
                        </tr>
                        <tr>
                            <td>67 - 70</td>
                            <td>15</td>
                        </tr>
                        <tr>
                            <td>70 - 72</td>
                            <td>16</td>
                        </tr>
                        <tr>
                            <td>72 - 75</td>
                            <td>17</td>
                        </tr>
                        <tr>
                            <td>75 - 77</td>
                            <td>18</td>
                        </tr>
                        <tr>
                            <td>77 - 80</td>
                            <td>19</td>
                        </tr>
                        <tr>
                            <td>80 - 82</td>
                            <td>20</td>
                        </tr>
                        <tr>
                            <td>82 - 85</td>
                            <td>21</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      <ToastContainer /> {/* Toast Container vẫn ở cuối */}
    </div>
  );
}