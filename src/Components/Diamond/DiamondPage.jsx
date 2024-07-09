import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiamondPage.css'; 

const DiamondPage = () => {
  const navigate = useNavigate();
  const [diamonds, setDiamonds] = useState([]);

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        const response = await fetch('https://localhost:7122/api/Diamond/GetDiamondList');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setDiamonds(data.data || []);
      } catch (error) {
        console.error('Error fetching the diamond list:', error);
      }
    };

    fetchDiamonds();
  }, []);

  const handleClick = (diamond) => {
    navigate(`/diamond-detail/${diamond.id}`, { state: { diamond } });
  };

  return (
    <div className="diamond-shop-container">
      <h1>The Diamonds</h1>
      <div className="diamond-grid">
        {diamonds.map((diamond, index) => (
          <div key={index} className="diamond-card" onClick={() => handleClick(diamond)}>
            <img
              className="diamond-image"
              src={diamond.images && diamond.images[0] ? diamond.images[0].urlPath : '/path/to/default/image.jpg'}
              alt={diamond.name}
            />
            <div className="diamond-content">
              <h2>{diamond.name}</h2>
              <h3>{diamond.price.toLocaleString()} VND</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
};

export default DiamondPage;
