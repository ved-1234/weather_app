import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

function Verification() {
    const inputsRef = useRef([]);

    const handleInput = (e, index) => {
        const value = e.target.value;

        // Move to the next input if a value is entered
        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }

        // If backspace is pressed and input is empty, move to the previous input
        if (!value && e.key === 'Backspace' && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '480px', borderRadius: '20px' }}>
                <h3 className="text-center">OTP (One Time Password)</h3>
                <hr />
                <h3 className="text-center" style={{ fontSize: '24px' }}>Enter your OTP</h3>
                <div className="d-flex justify-content-center mt-4">
                    {/* OTP Input Boxes */}
                    {[...Array(6)].map((_, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputsRef.current[i] = el)} // Store the ref
                            type="text"
                            className="form-control mx-1 text-center"
                            style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                            maxLength="1"
                            onChange={(e) => handleInput(e, i)}
                            onKeyDown={(e) => handleInput(e, i)} // Handle backspace
                        />
                    ))}
                </div>
                <div className="text-center mt-4">
                    <Link to="/">
                        <button className="btn btn-outline-dark px-4 py-2">Continue</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Verification;
