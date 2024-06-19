import React from 'react';
import { jwtDecode } from 'jwt-decode';
import './Admin.css';

import NavbarAdmin from './Navbar/NavbarAdmin';

export default function AdminNav() {
  return (
    <div className='pageAdminContainer'>
      <NavbarAdmin />
    </div>
  );
}