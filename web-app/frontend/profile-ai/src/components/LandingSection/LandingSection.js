import React, { useEffect, useState } from 'react';
import './LandingSection.css'; // Import CSS for styles
import landing from '../../assets/landing.mp4';

const LandingSection = () => {
    const fullText = "Highlight What Matters. Land What Counts!";
    const [displayText, setDisplayText] = useState('');
    const typingSpeed = 50; // Speed of typing in milliseconds

    useEffect(() => {
        const typingInterval = setInterval(() => {
            setDisplayText((prev) => {
                if (prev.length < fullText.length) {
                    return fullText.substring(0, prev.length + 1);
                } else {
                    clearInterval(typingInterval); // Stop typing when done
                    return prev;
                }
            });
        }, typingSpeed);

        return () => clearInterval(typingInterval); // Cleanup on unmount
    }, []);

    return (
        <div className="landing-section">
            <div className="video-tint">
                <video autoPlay muted loop className="background-video">
                    <source src={landing} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="text-container">
                <span>
                    {displayText.split(" ").map((word, idx) => {
                        if (word === "Matters") {
                            return <span key={idx} style={{ color: 'pink' }}>{word} </span>;
                        } else if (word === "Counts!") {
                            return <span key={idx} style={{ color: 'blue' }}>{word}</span>;
                        }
                        return <span key={idx}>{word} </span>;
                    })}
                </span>
            </div>
        </div>
    );
};

export default LandingSection;
