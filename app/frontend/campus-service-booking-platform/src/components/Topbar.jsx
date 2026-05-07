

import { useNavigate } from "react-router-dom";

function Topbar() {
    const navigate = useNavigate();

    // 🔹 retrieve user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const name = user?.nom || "Utilisateur";
    const initial = name.charAt(0).toUpperCase();

    return (
        <div className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">

            {/* LEFT */}
            <div>
                <h1 className="text-lg font-semibold text-white">
                    Hi, <span className="text-blue-400">{name}</span>
                </h1>

                <p className="text-xs text-gray-500">
                    Welcome back to your dashboard
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* NOTIF */}
                <button className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
                    🔔
                </button>

                {/* AVATAR */}
                <div className="relative">

                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-md">
                        {initial}
                    </div>

                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></span>

                </div>

                {/* LOGOUT */}
                <button
                    onClick={logout}
                    className="px-4 py-2 text-sm rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Topbar;