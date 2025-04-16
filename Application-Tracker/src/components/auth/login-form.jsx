import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login-form-styles.css"; 

export function LoginForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
                if (formData.email.includes("hr@") || formData.email.includes("admin@")) {
                    navigate("/dashboard");
                } else {
                    navigate("/jobs");
                }
            }, 2000);
        }, 1000);
    };

    return (
        <div className="main-container">
            {/* Toast Notification */}
            {showToast && (
                <div className="toast">
                    Login successful! Redirecting...
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
                    <p className="app-description">Manage your hiring process efficiently</p>
                </div>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-fields">
                        <div className="form-group">
                            <label htmlFor="email" className="input-label">
                                Email Address
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
                            <div className="password-header">
                                <label htmlFor="password" className="input-label">
                                    Password
                                </label>
                                <a
                                    href="/reset-password"
                                    className="forgot-password"
                                >
                                    Forgot password?
                                </a>
                            </div>
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
                            "Sign in"
                        )}
                    </button>

                    <div className="signup-link">
                        Not registered yet?{" "}
                        <a
                            href="/signup"
                            className="signup-text"
                        >
                            Create account
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}