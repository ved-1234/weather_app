import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // To make HTTP requests

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState('');
  const [hasAccount, setHasAccount] = useState(false); // Tracks if user has an account
  const navigate = useNavigate();

  const handleSignInClick = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setWarning('Please enter both username and password');
      return;
    }

    try {
      // Send username and password to backend for verification
      const response = await axios.post('http://localhost:5000/api/check-user', { username, password });

      if (response.status === 200) {
        // User verified successfully                      
        setHasAccount(true); // Set account as verified
        navigate('/weather'); // Navigate to the next page (weather in this case)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setWarning(error.response.data.message); // Display error message
      } else {
        setWarning('Error verifying user');
      }
    }
  };

  return (
    <div className="card " style={{ width: '90%', maxWidth: '35rem', top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%, -50%)', overflow: 'hidden' }}>
      <div className="card-body">
        <h5 className="card-title text-center" style={{ fontSize: '35px' }}>Login</h5>
        <hr style={{ width: '100%', border: '1px solid #ccc', margin: '0' }} />

        {/* Grid layout for the form */}
        <div className="container">
          {/* Username Field */}
          <div className="row mt-3">
            <div className="col-12 col-sm-4 d-flex align-items-center mb-3 mb-sm-0">
              <label htmlFor="username">Enter Username:</label>
            </div>
            <div className="col-12 col-sm-8">
              <input
                type="text"
                name="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  padding: '8px',
                  border: '1px solid #000',
                  borderRadius: '5px'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="row mt-3">
            <div className="col-12 col-sm-4 d-flex align-items-center mb-3 mb-sm-0">
              <label htmlFor="password">Enter Password:</label>
            </div>
            <div className="col-12 col-sm-8">
              <input
                type="password"
                name="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: '8px',
                  border: '1px solid #000',
                  borderRadius: '5px'
                }}
              />
            </div>
          </div>

          {/* Warning Message */}
          {warning && (
            <div className="row mt-3">
              <div className="col-12">
                <p className="text-danger text-center">{warning}</p>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="row mt-5">
            <div className="col-12 col-sm-6 mb-3 mb-sm-0 text-center">
              <Link
                to="/account"
                className="card-link"
                onClick={() => setHasAccount(true)} // Simulate account creation
              >
                Create Account
              </Link>
            </div>
            <div className="col-12 col-sm-6 text-sm-end text-center">
              <Link
                to="/weather"
                className="card-link"
                onClick={handleSignInClick} // Check account status before navigation
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
