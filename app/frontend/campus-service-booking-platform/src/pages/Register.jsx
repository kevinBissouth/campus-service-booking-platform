import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({
        nom: "",
        date_de_naissance: "",
        email: "",
        role: 1,
        mot_de_passe: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 handle input changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // 🔹 submit API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post("http://127.0.0.1:8000/users/add_user/", form);
            navigate("/login");
            
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || "Server error");
            } else {
                setError("Server unavailable");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">

            {/* GLOW */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 opacity-30 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600 opacity-30 blur-3xl rounded-full"></div>

            {/* CARD */}
            <div className="relative z-10 bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Register
                </h2>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-500/20 text-red-400 text-sm p-2 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* NAME */}
                    <input
                        type="text"
                        name="nom"
                        placeholder="Name (2-20 characters)"
                        value={form.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* DATE NAISSANCE */}
                    <input
                        type="date"
                        name="date_de_naissance"
                        max={today}
                        value={form.date_de_naissance}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />

                    {/* EMAIL */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                    />

                    {/* PASSWORD */}
                    <input
                        type="password"
                        name="mot_de_passe"
                        placeholder="Password (min 8 characters)"
                        value={form.mot_de_passe}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* ROLE */}
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                    >
                        <option value={1}>Student</option>
                        <option value={0}>Administrator</option>
                    </select>

                    {/* BTN */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-2 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Sign up"}
                    </button>

                </form>

                {/* LOGIN LINK */}
                <p className="text-gray-400 text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;