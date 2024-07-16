import React, { useState, useEffect } from 'react';
import CRUDProductType from './CRUDProductType'; 

export default function ProductType() {
	return (
		<div className='contentAdminContainer'>
			<div className='CRUDContainer '>
				<div className='titleOfFormContainer'>
					<h2>Loại sản phẩm</h2>
				</div>
				<div className='buttonContainer'>
					<CRUDProductType></CRUDProductType>
				</div>
			</div>
		</div>
	)
}