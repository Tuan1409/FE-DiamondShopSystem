import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({}); // Lưu trữ lỗi từ backend
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi khi submit
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!address) {
      newErrors.address = "Address is required";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone Number must be at least 10 digits";
    }

    if (!gender) {
      newErrors.gender = "Gender is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }  
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
  
        // Hiển thị thông báo lỗi từ backend
        if (errorData.message) {
          setErrors({ general: errorData.message });
        } else {
          // Xử lý lỗi khác nếu cần
          setErrors({ general: 'Có lỗi xảy ra trong quá trình đăng ký.' });
        }
        return;
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
        {errors.general && <div className="error-message">{errors.general}</div>}
        <div className='loginInputContainer'>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Enter your email here"
                className='form-control'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className='form-control'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            <div> {/* Name */}
              <input
                type="text"
                placeholder="Name"
                className='form-control'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <div> {/* Address */}
              <input
                type="text"
                placeholder="Address"
                className='form-control'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <div className="error-message">{errors.address}</div>}
            </div>
            <div> {/* Phone Number */}
              <input
                type="text"
                placeholder="Phone Number"
                className='form-control'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
            </div>
            <div>
              <select
                className='form-control'
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <div className="error-message">{errors.gender}</div>}
            </div>

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

