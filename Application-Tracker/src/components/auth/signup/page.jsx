import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-fixed flex items-center justify-center">
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
                    Account created successfully! Redirecting...
                </div>
            )}

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl mx-4">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <svg
                            className="w-8 h-8 text-blue-600"
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
                        <h2 className="text-2xl font-semibold text-white tracking-tight">Application Tracker</h2>
                    </div>
                    <p className="text-slate-200 text-sm">Manage your career journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-100 mb-1">
                                    First Name
                                </label>
                                <input
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-100 mb-1">
                                    Last Name
                                </label>
                                <input
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-100 mb-1">
                                Email
                            </label>
                            <input
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-100 mb-1">
                                Password
                            </label>
                            <input
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-100 mb-1">
                                Confirm Password
                            </label>
                            <input
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                // ... rest of input props
                            />
                            {!passwordsMatch && (
                                <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 mx-auto"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.041 1.134 5.823 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            "Create account"
                        )}
                    </button>

                    <p className="text-center text-slate-300 text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-300 hover:text-blue-200 font-medium">
                            Sign in
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}