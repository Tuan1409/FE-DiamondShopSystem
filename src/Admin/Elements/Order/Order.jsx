
import React from 'react';
import CRUDOrder from './CRUDOrder';

export default function Order() {
  return (
    <div className="contentAdminContainer">
      <div className="CRUDContainer ">
        <div className="titleOfFormContainer">
          <h2>Order</h2>
        </div>
        <div className="buttonContainer">
          <CRUDOrder />
        </div>
      </div>
    </div>
  );
}