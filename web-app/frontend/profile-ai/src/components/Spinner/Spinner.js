import React from 'react';
import './Spinner.css'; // Create a Spinner.css for styling

const Spinner = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default Spinner;
