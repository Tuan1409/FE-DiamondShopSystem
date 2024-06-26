// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './DiamondDetailPage.css';

// const DiamondDetailPage = () => {
//   const { id } = useParams();
//   const [diamond, setDiamond] = useState(null);

//   useEffect(() => {
//     const fetchDiamondDetails = async () => {
//       try {
//         const response = await axios.get(`/api/diamonds/${id}`);
//         setDiamond(response.data);
//       } catch (error) {
//         console.error('Error fetching diamond details:', error);
//       }
//     };

//     fetchDiamondDetails();
//   }, [id]);

//   if (!diamond) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="diamond-detail-container">
//       <h1>{diamond.Name}</h1>
//       <div className="diamond-detail-image-container">
//         <img src={`/path/to/diamond/images/${diamond.Id}.jpg`} alt={diamond.Name} className="diamond-detail-image" />
//       </div>
//       <div className="diamond-detail-info">
//         <p><strong>Origin Name:</strong> {diamond.OriginName}</p>
//         <p><strong>Carat Weight:</strong> {diamond.CaratWeight}</p>
//         <p><strong>Clarity:</strong> {diamond.ClarityName}</p>
//         <p><strong>Cut:</strong> {diamond.CutName}</p>
//         <p><strong>Color:</strong> {diamond.Color}</p>
//         <p><strong>Price:</strong> ${diamond.Price}</p>
//         <p><strong>Quantity:</strong> {diamond.Quantity}</p>
//       </div>
//     </div>
//   );
// };

// export default DiamondDetailPage;

//------------------------------------------------------------------
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import './DiamondDetailPage.css';

// // Mock API call
// const fetchDiamondDetails = async (id) => {
//   // Simulated diamond data
//   const mockDiamondData = {
//     Id: id,
//     Name: `BST LUCKYSTAR ${id}`,
//     OriginName: 'South Africa',
//     CaratWeight: 4.5,
//     ClarityName: 'VS1',
//     CutName: 'Excellent',
//     Color: 'D',
//     Price: 447.94,
//     Quantity: 10,
//     CreatedDate: '2023-01-01',
//     CreatedBy: 1,
//     ModifiedDate: '2023-02-01',
//     ModifiedBy: 2,
//     DeletedDate: null,
//     DeletedBy: null,
//     IsDeleted: false
//   };
//   return new Promise((resolve) => {
//     setTimeout(() => resolve({ data: mockDiamondData }), 500);
//   });
// };

// const DiamondDetailPage = () => {
//   const { id } = useParams();
//   const [diamond, setDiamond] = useState(null);

//   useEffect(() => {
//     const fetchDiamond = async () => {
//       try {
//         const response = await fetchDiamondDetails(id);
//         setDiamond(response.data);
//       } catch (error) {
//         console.error('Error fetching diamond details:', error);
//       }
//     };

//     fetchDiamond();
//   }, [id]);

//   if (!diamond) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="diamond-detail-container">
//       <h1>{diamond.Name}</h1>
//       <div className="diamond-detail-image-container">
//         <img src={`/path/to/diamond/images/${diamond.Id}.jpg`} alt={diamond.Name} className="diamond-detail-image" />
//       </div>
//       <div className="diamond-detail-info">
//         <p><strong>Origin Name:</strong> {diamond.OriginName}</p>
//         <p><strong>Carat Weight:</strong> {diamond.CaratWeight}</p>
//         <p><strong>Clarity:</strong> {diamond.ClarityName}</p>
//         <p><strong>Cut:</strong> {diamond.CutName}</p>
//         <p><strong>Color:</strong> {diamond.Color}</p>
//         <p><strong>Price:</strong> ${diamond.Price}</p>
//         <p><strong>Quantity:</strong> {diamond.Quantity}</p>
//       </div>
//     </div>
//   );
// };

// export default DiamondDetailPage;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DiamondDetailPage.css';

const DiamondDetailPage = () => {
  const { id } = useParams();
  const [diamond, setDiamond] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiamond = async () => {
      try {
        const response = await axios.get(`https://localhost:7122/api/Diamond/GetDiamondList/${id}`);
        setDiamond(response.data);
      } catch (error) {
        console.error('Error fetching diamond details:', error);
        setError('Failed to fetch diamond details. Please try again later.');
      }
    };

    fetchDiamond();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!diamond) {
    return <div>No diamond details found.</div>;
  }

  return (
    <div className="diamond-detail-container">
      <h1>Diamond Detail</h1>
      <div className="diamond-detail-image-container">
        <img src={`/path/to/diamond/images/${diamond.id}.jpg`} alt={`Diamond ${diamond.id}`} className="diamond-detail-image" />
      </div>
      <div className="diamond-detail-info">
        <p><strong>Origin Name:</strong> {diamond.originName}</p>
        <p><strong>Carat Weight:</strong> {diamond.caratWeight}</p>
        <p><strong>Clarity:</strong> {diamond.clarityName}</p>
        <p><strong>Cut:</strong> {diamond.cutName}</p>
        <p><strong>Color:</strong> {diamond.color}</p>
        <p><strong>Price:</strong> ${diamond.price}</p>
      </div>
    </div>
  );
};

export default DiamondDetailPage;
