
import { useState, useEffect } from "react";
import axios from "axios";

function FloatingAddButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [toast, setToast] = useState(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = Number(user.id || 0);

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        etudiant: userId,
        admin: 0,
        email: user.email || "",
        service_choisis: 0,
        demande: "",
        date_souhaitee: "",
        creneau_debut: "",
        creneau_fin: "",
        statut: "pending"
    });

    useEffect(() => {
        // Récupérer les services disponibles
        axios.get("http://127.0.0.1:8000/services")
            .then((res) => {
                const items = Array.isArray(res.data) ? res.data : [];
                setServices(items);
                if (items.length > 0 && !form.service_choisis) {
                    setForm((prev) => ({ ...prev, service_choisis: items[0].id }));
                }
            })
            .catch((err) => console.error("Error fetching services:", err));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const studentId = Number(form.etudiant);
            const adminId = Number(form.admin);
            const serviceId = Number(form.service_choisis);
            const start = form.creneau_debut;
            const end = form.creneau_fin;

            if (!Number.isInteger(studentId) || studentId <= 0) {
                throw new Error("Invalid student ID.");
            }

            if (!Number.isInteger(serviceId) || serviceId <= 0) {
                throw new Error("Please select a valid service.");
            }

            if (!start || !end) {
                throw new Error("Please select a valid time slot.");
            }

            if (start >= end) {
                throw new Error("End time must be later than start time.");
            }

            const payload = {
                ...form,
                etudiant: studentId,
                admin: Number.isInteger(adminId) ? adminId : 0,
                service_choisis: serviceId,
                creneau_horaire: `${start} - ${end}`,
            };

            console.log("Reservation payload:", payload);
            await axios.post("http://127.0.0.1:8000/bookings", payload, {
                headers: { "Content-Type": "application/json" },
            });
            setToast({ type: "success", message: "Reservation créée avec succès !" });
            setTimeout(() => setToast(null), 5000);
            setOpen(false);
            setForm({
                etudiant: userId,
                admin: 0,
                email: user.email || "",
                service_choisis: services.length > 0 ? services[0].id : 0,
                demande: "",
                date_souhaitee: "",
                creneau_debut: "",
                creneau_fin: "",
                statut: "pending"
            });
            // Recharger la page pour voir la nouvelle réservation
            window.location.reload();
        } catch (err) {
            console.error("Error creating reservation:", err);
            const errorData = err.response?.data;
            let errorMessage = "Error creating reservation";

            if (errorData) {
                if (typeof errorData === "string") {
                    errorMessage = errorData;
                } else if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail
                        .map((item) => item.msg || JSON.stringify(item))
                        .join(" \n");
                } else if (errorData.detail) {
                    errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
                } else if (errorData.error) {
                    errorMessage = typeof errorData.error === "string" ? errorData.error : JSON.stringify(errorData.error);
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6">

            {/* BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-2xl shadow-xl hover:scale-110 transition"
            >
                +
            </button>

            {/* MODAL FORM */}
            {open && (
                <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-24 pb-8" style={{ zIndex: 99999 }}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-3 w-full max-w-2xl">

                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-white">
                                New Reservation
                            </h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-2">

                            <div className="grid grid-cols-3 gap-3">

                                {/* SERVICE */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">
                                        Service *
                                    </label>
                                    <select
                                        name="service_choisis"
                                        value={form.service_choisis}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value={0} disabled>Select a service</option>
                                        {services.length === 0 ? (
                                            <option value={0} disabled>
                                                Loading services...
                                            </option>
                                        ) : (
                                            services.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.nom}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                {/* STUDENT ID (DISABLED) */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        value={form.etudiant}
                                        disabled
                                        className="w-full px-2 py-1 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 text-sm cursor-not-allowed"
                                    />
                                </div>

                                {/* EMAIL (DISABLED) */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        disabled
                                        className="w-full px-2 py-1 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 text-sm cursor-not-allowed"
                                    />
                                </div>

                                {/* DATE */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">
                                        Desired date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_souhaitee"
                                        min={today}
                                        value={form.date_souhaitee}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* TIME SLOT */}
                                <div className="col-span-3 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">
                                            Start time *
                                        </label>
                                        <input
                                            type="time"
                                            name="creneau_debut"
                                            value={form.creneau_debut}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">
                                            End time *
                                        </label>
                                        <input
                                            type="time"
                                            name="creneau_fin"
                                            value={form.creneau_fin}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* STATUS (DISABLED) */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">
                                        Status
                                    </label>
                                    <input
                                        type="text"
                                        value={form.statut}
                                        disabled
                                        className="w-full px-2 py-1 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 text-sm cursor-not-allowed"
                                    />
                                </div>

                            </div>

                            {/* DEMAND - FULL WIDTH */}
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">
                                    Request details *
                                </label>
                                <textarea
                                    name="demande"
                                    value={form.demande}
                                    onChange={handleChange}
                                    required
                                    placeholder="Describe your request..."
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows="2"
                                />
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition font-semibold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition font-semibold text-sm disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed bottom-6 left-6 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-[999999]">
                    <span className="text-xl">✓</span>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}

export default FloatingAddButton;