import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [openProfile, setOpenProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        filiere: user.profil?.filiere || "",
        niveau: user.profil?.niveau || "",
        poste_campus: user.profil?.poste_campus || "",
        date_de_naissance: user.date_de_naissance || ""
    });

    const roleLabel = user.role === 0 ? "Administrator" : "Student";

    const navigateLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    const base =
        "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition";

    const active =
        "bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/10 text-white border border-blue-500/30";

    const inactive =
        "text-gray-400 hover:text-white hover:bg-gray-800/60";

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveProfile = async () => {
        try {
            await axios.put(
                "http://127.0.0.1:8000/users/profil/",
                {
                    id_utilisateur: user.id,
                    ...form
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const updatedUser = {
                ...user,
                profil: {
                    ...user.profil,
                    filiere: form.filiere,
                    niveau: form.niveau,
                    poste_campus: form.poste_campus
                }
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);

        } catch (err) {
            console.error("Profile update error:", err);
        }
    };

    const resetForm = () => {
        setForm({
            filiere: user.profil?.filiere || "",
            niveau: user.profil?.niveau || "",
            poste_campus: user.profil?.poste_campus || "",
        });
    };

    return (
        <div className="relative w-64 h-screen bg-gray-950 border-r border-gray-800 flex flex-col">

            {/* BRAND */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold text-white">
                    CampusService
                </h1>
            </div>

            {/* MENU */}
            <nav className="flex-1 p-4 space-y-2">

                <Link to="/dashboard" className={`${base} ${isActive("/dashboard") ? active : inactive}`}>
                    📊 Dashboard
                </Link>

                <Link to="/services" className={`${base} ${isActive("/services") ? active : inactive}`}>
                    🧾 Services
                </Link>


            </nav>

            {/* USER SECTION */}
            <div className="p-4 border-t border-gray-800">

                {/* USER BUTTON */}
                <div
                    onClick={() => setOpenProfile(!openProfile)}
                    className="cursor-pointer flex items-center gap-3 p-3 rounded-xl bg-gray-900 hover:bg-gray-800 transition"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.nom?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <p className="text-white text-sm font-medium">{user.nom}</p>
                        <p className="text-gray-400 text-xs">{roleLabel}</p>
                    </div>
                </div>

                {/* POPUP */}
                {openProfile && (
                    <div className="absolute bottom-24 left-4 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5 z-50">

                        {/* HEADER */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {user.nom?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <p className="text-white font-semibold">{user.nom}</p>
                                <p className="text-xs text-gray-400">{roleLabel}</p>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="mb-3 text-sm text-gray-300">
                            <span className="text-gray-500">Email:</span> {user.email}
                        </div>

                        {/* PROFILE */}
                        <div className="space-y-3 text-sm">

                            <div>
                                <p className="text-gray-500 text-xs">Field of study</p>
                                {isEditing ? (
                                    <input
                                        name="filiere"
                                        value={form.filiere}
                                        onChange={handleChange}
                                        className="w-full p-2 mt-1 rounded-lg bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p className="text-white">{user.profil?.filiere || "Not defined"}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs">Level</p>
                                {isEditing ? (
                                    <input
                                        name="niveau"
                                        value={form.niveau}
                                        onChange={handleChange}
                                        className="w-full p-2 mt-1 rounded-lg bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p className="text-white">{user.profil?.niveau || "Not defined"}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs">Campus role</p>
                                {isEditing ? (
                                    <input
                                        name="poste_campus"
                                        value={form.poste_campus}
                                        onChange={handleChange}
                                        className="w-full p-2 mt-1 rounded-lg bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p className="text-white">{user.profil?.poste_campus || "Not defined"}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs">Date of birth</p>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="date_de_naissance"
                                        value={form.date_de_naissance}
                                        onChange={handleChange}
                                        className="w-full p-2 mt-1 rounded-lg bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p className="text-white">{user.date_de_naissance || "Not defined"}</p>
                                )}
                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 mt-5">

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 py-2 rounded-xl bg-blue-600/20 text-blue-300 text-sm"
                                >
                                    ✏️ Edit profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            resetForm();
                                        }}
                                        className="flex-1 py-2 rounded-xl bg-gray-700 text-white text-sm"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={saveProfile}
                                        className="flex-1 py-2 rounded-xl bg-green-600/20 text-green-300 text-sm"
                                    >
                                        Save
                                    </button>
                                </>
                            )}

                            <button
                                onClick={navigateLogout}
                                className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm"
                            >
                                Logout
                            </button>

                        </div>

                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenProfile(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Sidebar;