import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Account() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    mobileno: '',
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure formData to access individual fields
    const { email, mobileno, password, username } = formData;

    try {
      // Send data to backend
      const response = await axios.post('http://localhost:5000/api/users', {
        email: email,
        mobileno: mobileno,
        password: password,
        username: username
      });

      console.log("User created successfully", response.data);

      // Check if the response contains a success message and OTP was sent
      if (response.data.message === 'User created. OTP sent to email.') {
        // Redirect to verification page if OTP was sent successfully
        navigate('/verification');
      }
    } catch (error) {
      console.error("Error creating user:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card" style={{ width: '90%', maxWidth: '600px', border: '1px solid black', padding: '20px' }}>
        <h2 className="text-center">Create Account</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="row mt-4">
            <div className="col-12 col-sm-5 text-sm-end mb-2 mb-sm-0">
              <label htmlFor="username" style={{ fontSize: '20px' }}>Enter Username:</label>
            </div>
            <div className="col-12 col-sm-7">
              <input
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #000',
                  borderRadius: '5px',
                  boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
                }}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="row mt-4">
            <div className="col-12 col-sm-5 text-sm-end mb-2 mb-sm-0">
              <label htmlFor="password" style={{ fontSize: '20px' }}>Enter Password:</label>
            </div>
            <div className="col-12 col-sm-7">
              <input
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #000',
                  borderRadius: '5px',
                  boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
                }}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="5"
                maxLength="20"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="row mt-4">
            <div className="col-12 col-sm-5 text-sm-end mb-2 mb-sm-0">
              <label htmlFor="email" style={{ fontSize: '20px' }}>Enter Email:</label>
            </div>
            <div className="col-12 col-sm-7">
              <input
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #000',
                  boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
                  borderRadius: '5px',
                }}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Mobile Number Field */}
          <div className="row mt-4">
            <div className="col-12 col-sm-5 text-sm-end mb-2 mb-sm-0">
              <label htmlFor="mobileno" style={{ fontSize: '20px' }}>Enter Mobile No:</label>
            </div>
            <div className="col-12 col-sm-7">
              <input
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #000',
                  borderRadius: '5px',
                  boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
                }}
                type="text"
                id="mobileno"
                name="mobileno"
                value={formData.mobileno}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="row mt-5">
            <div className="col text-center">
              <button
                className="btn btn-primary w-100"
                type="submit"
                style={{
                  borderRadius: '10px',
                  padding: '10px 20px',
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account;

