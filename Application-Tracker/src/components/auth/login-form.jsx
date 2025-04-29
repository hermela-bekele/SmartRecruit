import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
                    Login successful! Redirecting...
                </div>
            )}

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {/* Keep the SVG path the same */}
                        </svg>
                        <h2 className="text-2xl font-semibold text-white">Application Tracker</h2>
                    </div>
                    <p className="text-slate-200">Manage your hiring process efficiently</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-100 mb-1">
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
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-100">
                                    Password
                                </label>
                                <a href="/reset-password" className="text-sm text-blue-200 hover:text-blue-100">
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
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 mx-auto"
                                viewBox="0 0 24 24"
                            >
                                {/* Keep the SVG path the same */}
                            </svg>
                        ) : (
                            "Sign in"
                        )}
                    </button>

                    <p className="text-center text-slate-300">
                        Not registered yet?{" "}
                        <a href="/signup" className="text-blue-300 hover:text-blue-200">
                            Create account
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}