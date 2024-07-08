import React from 'react';
import ReadPromotion from './CRUDPromotion';

export default function Promotion() {
  return (
    <div className='contentAdminContainer'>
      <div className='CRUDContainer '>
        <div className='titleOfFormContainer'>
          <h2>Promotion</h2>
        </div>
        <div className='buttonContainer'>
          <ReadPromotion /> 
        </div>
      </div>
    </div>
  );
}