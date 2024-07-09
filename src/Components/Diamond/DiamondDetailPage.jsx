import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DiamondDetailPage.css';

const DiamondDetailPage = () => {
  const location = useLocation();
  const { diamond } = location.state || {};
  const [diamondDetail, setDiamondDetail] = useState(null);

  useEffect(() => {
    if (diamond && diamond.id) {
      fetch(`https://localhost:7122/api/Diamond/GetDiamondById/${diamond.id}`)
        .then(response => response.json())
        .then(data => {
          setDiamondDetail(data.data);
        })
        .catch(error => {
          console.error('Error fetching diamond details:', error);
        });
    }
  }, [diamond]);

  if (!diamondDetail) {
    return <div>No diamond details available.</div>;
  }

  const handleAddToCart = () => {
    setCartItems(cartItems + 1);
  };

  return (
    <div className="diamond-detail-container">
      <h1>{diamondDetail.name}</h1>
      <img
        className="diamond-detail-image"
        src={diamondDetail.images && diamondDetail.images[0] ? diamondDetail.images[0].urlPath : '/path/to/default/image.jpg'}
        alt={diamondDetail.name}
      />
      <div className="diamond-detail-content">
        <p><strong>Origin Name:</strong> {diamondDetail.originName}</p>
        <p><strong>Carat Weight:</strong> {diamondDetail.caratWeight} ly</p>
        <p><strong>Clarity:</strong> {diamondDetail.clarityName}</p>
        <p><strong>Cut:</strong> {diamondDetail.cutName}</p>
        <p><strong>Color:</strong> {diamondDetail.color}</p>
        <p><strong>Price:</strong> {diamondDetail.price.toLocaleString()} VND</p>
        <p><strong>Quantity:</strong> {diamondDetail.quantity}</p>
        <button onClick={handleAddToCart}> Add to cart</button>
      </div>
    </div>
  );
};

export default DiamondDetailPage;
