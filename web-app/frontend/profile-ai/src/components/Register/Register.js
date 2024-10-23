import React, { useState } from 'react';
import Spinner from '../Spinner/Spinner'; // Import the Spinner component
import Popup from '../Popup/Popup'; // Import the Popup component
import './Register.css';

const Register = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        linkedInUrl: '',
        githubUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const steps = [
        {
            title: 'Step 1: Credentials',
            comment: 'Let’s start with the basics!',
            content: (
                <>
                    {errors.email && <p className="error-message">Email is required.</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                        className={errors.email ? 'error' : ''}
                    />

                    {errors.password && <p className="error-message">Password is required.</p>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        className={errors.password ? 'error' : ''}
                    />

                    {errors.confirmPassword && (
                        <p className="error-message">Passwords do not match.</p>
                    )}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange(e, 'confirmPassword')}
                        className={errors.confirmPassword ? 'error' : ''}
                    />
                </>
            ),
        },
        {
            title: 'Step 2: Personal Information',
            comment: 'Who are you, really?',
            content: (
                <>
                    {errors.firstName && <p className="error-message">First Name is required.</p>}
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange(e, 'firstName')}
                        className={errors.firstName ? 'error' : ''}
                    />

                    {errors.lastName && <p className="error-message">Last Name is required.</p>}
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange(e, 'lastName')}
                        className={errors.lastName ? 'error' : ''}
                    />

                    {errors.phoneNumber && <p className="error-message">Phone Number is required.</p>}
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange(e, 'phoneNumber')}
                        className={errors.phoneNumber ? 'error' : ''}
                    />
                </>
            ),
        },
        {
            title: 'Step 3: Address Information',
            comment: 'Where do you call home?',
            content: (
                <>
                    {errors.street && <p className="error-message">Street Address is required.</p>}
                    <input
                        type="text"
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={(e) => handleInputChange(e, 'street')}
                        className={errors.street ? 'error' : ''}
                    />

                    {errors.city && <p className="error-message">City is required.</p>}
                    <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange(e, 'city')}
                        className={errors.city ? 'error' : ''}
                    />

                    {errors.state && <p className="error-message">State is required.</p>}
                    <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => handleInputChange(e, 'state')}
                        className={errors.state ? 'error' : ''}
                    />

                    {errors.country && <p className="error-message">Country is required.</p>}
                    <input
                        type="text"
                        placeholder="Country"
                        value={formData.country}
                        onChange={(e) => handleInputChange(e, 'country')}
                        className={errors.country ? 'error' : ''}
                    />

                    {errors.postalCode && <p className="error-message">Postal Code is required.</p>}
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange(e, 'postalCode')}
                        className={errors.postalCode ? 'error' : ''}
                    />
                </>
            ),
        },
        {
            title: 'Step 4: Social Profiles',
            comment: 'Almost there! Let’s connect.',
            content: (
                <>
                    <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={formData.linkedInUrl}
                        onChange={(e) => handleInputChange(e, 'linkedInUrl')}
                    />

                    <input
                        type="url"
                        placeholder="GitHub URL"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange(e, 'githubUrl')}
                    />
                </>
            ),
        },
    ];

    const handleInputChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (currentStep === 0) {
            if (!formData.email) newErrors.email = true;
            if (!formData.password) newErrors.password = true;
            if (!formData.confirmPassword) newErrors.confirmPassword = true;
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        } else if (currentStep === 1) {
            if (!formData.firstName) newErrors.firstName = true;
            if (!formData.lastName) newErrors.lastName = true;
            if (!formData.phoneNumber) newErrors.phoneNumber = true;
        } else if (currentStep === 2) {
            if (!formData.street) newErrors.street = true;
            if (!formData.city) newErrors.city = true;
            if (!formData.state) newErrors.state = true;
            if (!formData.postalCode) newErrors.postalCode = true;
            if (!formData.country) newErrors.country = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            if (validateForm()) {
                setCurrentStep((prevStep) => prevStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };

    const submitForm = async () => {
        console.log(process.env.REACT_APP_WEB_API_BASE_URL);
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_WEB_API_BASE_URL}/profileai/web/v1/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.email,
                    password: formData.password,
                    email: formData.email,
                    phonenumber: formData.phoneNumber,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        postalCode: formData.postalCode,
                        country: formData.country,
                    },
                    linkedInUrl: formData.linkedInUrl,
                    githubUrl: formData.githubUrl,
                }),
            });

            if (response.ok){
                const data = await response.json();
                setPopupMessage('User registered successfully!');
                setIsSuccess(true);
                setShowPopup(true);
                console.log(data);
            }
            else{
                setPopupMessage('Oops! Something went wrong');
                setIsSuccess(false);
                setShowPopup(true);
            }
            const data = await response.json();
            console.log('Form submitted successfully:', data);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false); // Hide spinner
            setShowPopup(true); // Show popup message
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const progressPercentage = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="multi-step-form-container">
            {loading && <Spinner />}
            <div className="form-box">
                {/*<h2>{steps[currentStep].title}</h2>*/}
                <p className="step-comment">{steps[currentStep].comment}</p>
                <div className="form-content">{steps[currentStep].content}</div>
                <div className="form-navigation">
                    {currentStep > 0 && (
                        <button className="prev-button" onClick={prevStep}>
                            Previous
                        </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <button className="next-button" onClick={nextStep}>
                            Next
                        </button>
                    ) : (
                        <button className="submit-button" onClick={submitForm}>
                            Submit
                        </button>
                    )}
                </div>
            </div>
            {/* Progress bar */}
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            {showPopup && <Popup message={popupMessage} isSuccess={isSuccess} />}
        </div>
    );
};

export default Register;
