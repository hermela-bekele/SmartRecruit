import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "../styles/signup-form-style.css"; 

export function SignupForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: ""
    });
    const [showToast, setShowToast] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        if (name === "confirmPassword" || name === "password") {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
                navigate(formData.accountType === "hrProfessional" ? "/dashboard" : "/jobs");
            }, 2000);
        }, 1000);
    };

    return (
        <div className="main-container">
            {showToast && (
                <div className="toast">
                    Account created successfully! Redirecting...
                </div>
            )}

            <div className="form-container">
                <div className="header-section">
                    <div className="logo-container">
                        <svg
                            className="logo-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <h2 className="app-title">Application Tracker</h2>
                    </div>
                    <p className="app-description">Manage your career journey</p>
                </div>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-fields">
                       
                        <p className="section-subtitle">Enter your information to create an account</p>

                        <div className="name-fields">
                            <div className="form-group">
                                <label htmlFor="firstName" className="input-label">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="lastName" className="input-label">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <hr className="divider" />

                        <div className="form-group">
                            <label htmlFor="email" className="input-label">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="input-label">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="input-label">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                            {!passwordsMatch && (
                                <span className="error-message">Passwords do not match</span>
                            )}
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="submit-button"
                    >
                        {isLoading ? (
                            <svg
                                className="spinner"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="spinner-circle"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="spinner-path"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.041 1.134 5.823 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            "Create account"
                        )}
                    </button>

                    <div className="login-link">
                        Already have an account?{" "}
                        <a href="/login" className="login-text">
                            Sign in
                        </a>
                    </div>
                </form>
            </div>


        </div>
    );
}