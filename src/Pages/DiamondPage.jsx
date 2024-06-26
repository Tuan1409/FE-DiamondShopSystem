import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../Pages/DiamondPage.css'


const DiamondPage = () => {

	const navigate = useNavigate();
	const diamonds = [
	  { id: "1", name: 'BST LUCKYSTAR 3.4ly', price: '$407.94 USD', img: '../../src/assets/img/kc1.jpg'},
	  { id: "2", name: 'BST LUCKYSTAR 4.4ly', price: '$427.94 USD', img: '../../src/assets/img/kc2.jpg'},
	  { id: "3", name: 'BST LUCKYSTAR 4.5ly', price: '$447.94 USD', img: '../../src/assets/img/kc3.jpg'},
	  { id: "4", name: 'BST LUCKYSTAR 5.4ly', price: '$497.94 USD', img: '../../src/assets/img/kc4.jpg'},
	  { id: "5", name: 'BST GIA 3.6ly', price: '$400.52 USD', img: '../../src/assets/img/gia1.jpg'},
	  { id: "6", name: 'BST GIA 4.1ly', price: '$404.94 USD', img: '../../src/assets/img/gia2.jpg'},
	  { id: "7", name: 'BST GIA 4.5ly', price: '$409.94 USD', img: '../../src/assets/img/gia3.jpg'},
	  { id: "8", name: 'BST GIA 5.4ly', price: '$420.94 USD', img: '../../src/assets/img/gia4.jpg'}
	];

	const handleClick = (diamond) => {
		navigate(`/diamond-detail/${diamond.id}`, { state: { diamond } });
	  };

	return (
	  <div className="diamond-shop-container">
		<h1>The Diamonds</h1>

		{/* <div className='diamond-grid'>
                <ul className='slider-container productContainer' id='productContainerId'>
                    {diamonds.map((diamond) => (
                        <li key={diamond.id}>
                            <a href="" className='linkDiamond'>
                                <div className='card border-0'>
                                    <div className='ratio ratio-1x1'>
                                        <img src={diamond.img} alt='' className='diamond-image' />
                                    </div>
                                    <div className='card-body p-0 pt-2'>
                                        <div className='d-flex' id='textContainer'>
                                            <h3 className='flex-grow-1'>{diamond.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div> */}

<div className="diamond-grid">
        {diamonds.map((diamond, index) => (
          <div key={index} className="diamond-card" onClick={() => handleClick(diamond)}>
            <img src={diamond.img} alt="" className="diamond-image" />
            <div className="diamond-info">
              <h3>{diamond.name}</h3>
              <p>Diamond Story</p>
              <p className="diamond-price">{diamond.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="view-more-button">View More</button>
    </div>
	);
  };
  
  export default DiamondPage;
