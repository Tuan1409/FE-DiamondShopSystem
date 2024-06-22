import React from 'react'
import '../Pages/DiamondPage.css'


const DiamondPage = () => {
	const diamonds = [
	  { name: 'Addision N10p', price: '$1,516.19 USD', img: '../../src/assets/img/ring1.jpg'},
	  { name: 'Astera', price: '$427.94 USD', img: '../../src/assets/img/ring2.jpg'},
	  { name: 'Atlas 10p', price: '$1,540.20 USD', img: '../../src/assets/img/ring3.jpg'},
	  { name: 'Balland 10p', price: '$1,253.95 USD', img: '../../src/assets/img/ring4.jpg'},
	  { name: 'Beloved RD1C', price: '$1,255.80 USD', img: '../../src/assets/img/ring5.jpg'},
	  { name: 'Benecdict', price: '$273.32 USD', img: '../../src/assets/img/ring6.jpg'},
	  { name: 'Congenial RD2C&PR1C', price: '$2,397.09 USD', img: '../../src/assets/img/ring7.jpg'},
	  { name: 'Conjugal N10p', price: '$1,471.87 USD', img: '../../src/assets/img/ring8.jpg'}
	];
  
	return (
	  <div className="diamond-shop-container">
		<h1>The Wedding Rings</h1>
		<div className="diamond-grid">
		  {diamonds.map((diamond, index) => (
			<div key={index} className="diamond-card">
			  <img src={diamond.img} alt="Diamond" className="diamond-image" />
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
