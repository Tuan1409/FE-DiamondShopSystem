import React from 'react';
import ReadProduct from './CRUDProduct'; 

export default function Product() {
  return (
    <div className='contentAdminContainer'>
      <div className='CRUDContainer '>
        <div className='titleOfFormContainer'>
          <h2>Product</h2>
        </div>
        <div className='buttonContainer'>
          <ReadProduct></ReadProduct> 
        </div>
      </div>
    </div>
  );
}