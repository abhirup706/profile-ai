import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Popup.css';

const Popup = ({ message, isSuccess }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (isSuccess) {
            navigate('/try-it-out'); // Redirect to the login page if successful
        } else {
            window.location.reload(); // Redirect back to register page if failed
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{message}</h2>
                <button className="login-button" onClick={handleRedirect}>
                    {isSuccess ? "Let's login to your account" : "Let's try again"}
                </button>
            </div>
        </div>
    );
};

export default Popup;
