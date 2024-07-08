import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('Email', email);
      formData.append('Password', password);
      formData.append('Name', name);
      formData.append('Address', address);
      formData.append('PhoneNumber', phoneNumber);
      formData.append('Gender', gender);

      const response = await fetch('https://localhost:7122/api/Authentication/Register', {
        method: 'POST',
        body: formData, // Sử dụng FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.ErrorMessage || 'Error registering user');
      }

      const data = await response.json();
      // Xử lý phản hồi từ server
      console.log('Đăng ký thành công:', data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    }
  };

  return (
    <section className='pageLoginContainer'>
      <div className='loginContainer container-fluid'>
        <h1>SIGN UP</h1>
        {error && <div className="error-message">{error}</div>}
        <div className='loginInputContainer'>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email here"
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              className='form-control'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className='form-control'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Gender"
              className='form-control'
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />

            <div className='signupLink'>
              <button className='signUpButton'>
                SIGN UP
              </button>
            </div>
          </form>

          <div className='backToHomePageLink'>
            <Link to="/login" className='linkBackHome'>
              Back to login page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 