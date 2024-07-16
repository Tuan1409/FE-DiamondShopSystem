import React from 'react';
import CRUDDiamond from './CRUDDiamond'; 

export default function Diamond() {
  return (
    <div className='contentAdminContainer'>
      <div className='CRUDContainer '>
        <div className='titleOfFormContainer'>
          <h2>Diamond</h2>
        </div>
        <div className='buttonContainer'>
          <CRUDDiamond></CRUDDiamond>
        </div>
      </div>
    </div>
  );
}