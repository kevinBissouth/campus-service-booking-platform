import { useEffect, useState } from "react";
import axios from "axios";

function ReservationCard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [reservations, setReservations] = useState([]);
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [selected, setSelected] = useState(null);

    const [page, setPage] = useState(1);
    const perPage = 6;

    // Récupérer toutes les réservations
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/bookings")
            .then((res) => {
                setReservations(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Erreur API reservations:", err);
                setReservations([]);
            });
    }, []);

    // Récupérer tous les services pour le mapping des noms
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/services")
            .then((res) => {
                setServices(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Erreur API services:", err);
                setServices([]);
            });
    }, []);

    const serviceMap = services.reduce((acc, service) => {
        if (service?.id != null) {
            acc[service.id] = service.nom;
        }
        return acc;
    }, {});

    const safeReservations = Array.isArray(reservations) ? reservations : [];

    const sortedReservations = safeReservations
        .slice()
        .sort((a, b) => {
            const idA = Number(a?.id || 0);
            const idB = Number(b?.id || 0);
            if (idB !== idA) return idB - idA;
            return String(b.date_souhaitee || "").localeCompare(String(a.date_souhaitee || ""));
        });

    const userReservations = sortedReservations.filter((r) => {
        const etudiantId = Number(
            typeof r.etudiant === "object"
                ? r.etudiant?.id
                : r.etudiant
        );

        return etudiantId === Number(user.id);
    });

    // 🔁 traduction du statut (affichage seulement)
    const translateStatus = (status) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "accepted":
                return "Accepted";
            case "rejected":
                return "Rejected";
            default:
                return status;
        }
    };

    // RECHERCHE + FILTRAGE
    const filtered = userReservations.filter((r) => {
        const serviceName = serviceMap[r.service_choisis] || String(r.service_choisis || "");
        const matchSearch =
            (r.email || "").toLowerCase().includes(search.toLowerCase()) ||
            serviceName.toLowerCase().includes(search.toLowerCase()) ||
            (r.demande || "").toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            filter === "all" ? true : r.statut === filter;

        return matchSearch && matchFilter;
    });

    // PAGINATION
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    // VÉRIFICATION UTILISATEUR
    if (!user?.id) {
        return (
            <div className="p-6 text-white">
                Loading user...
            </div>
        );
    }

    return (
        <div className="p-6 w-full text-white">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                <h2 className="text-xl font-bold">
                    My bookings
                </h2>

                <div className="flex gap-3">

                    <input
                        className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />

                    <select
                        className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>

                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
                    <table className="w-full text-sm min-w-full">

                    <thead className="bg-gray-900 text-gray-400">
                        <tr>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Service</th>
                            <th className="p-3 text-left">Request</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Time slot</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-400">
                                    No bookings found
                                </td>
                            </tr>
                        ) : (
                            paginated.map((r, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setSelected(r)}
                                    className="border-t border-gray-800 hover:bg-gray-800/70 hover:shadow-sm transform hover:-translate-y-px cursor-pointer transition duration-200"
                                >

                                    <td className="p-3 max-w-[180px]">
                                        <span className="block truncate" title={r.email || "N/A"}>
                                            {truncate(r.email || "N/A", 25)}
                                        </span>
                                    </td>

                                    <td className="p-3 text-blue-300 max-w-[170px]">
                                        <span className="block truncate" title={serviceMap[r.service_choisis] || r.service_choisis}>
                                            {truncate(serviceMap[r.service_choisis] || String(r.service_choisis || "N/A"), 20)}
                                        </span>
                                    </td>

                                    <td className="p-3 text-gray-300 max-w-[220px]">
                                        <span className="block truncate" title={r.demande}>
                                            {truncate(r.demande, 30)}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        {r.date_souhaitee || "N/A"}
                                    </td>

                                    <td className="p-3">
                                        {r.creneau_horaire || "N/A"}
                                    </td>

                                    <td className="p-3">
                                        <span className={getStatusClass(r.statut || "pending")}>
                                            {translateStatus(r.statut || "pending")}
                                        </span>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>
                </div>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-400"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                </div>
            )}

            {/* MODAL */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

                    <div className="bg-gray-900 p-6 rounded-3xl w-full max-w-2xl border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">

                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    Booking details
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Full reservation information is shown here.
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-400 hover:text-white text-2xl"
                                aria-label="Close details"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white font-medium break-words">{selected.email}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Service</p>
                                <p className="text-white font-medium break-words">
                                    {serviceMap[selected.service_choisis] || selected.service_choisis}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Date</p>
                                <p className="text-white font-medium">{selected.date_souhaitee}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Time slot</p>
                                <p className="text-white font-medium">{selected.creneau_horaire}</p>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-800 rounded-2xl p-4 border border-gray-700">
                            <p className="text-sm text-gray-400 mb-3">Request details</p>
                            <p className="text-white whitespace-pre-wrap">{selected.demande}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Status</p>
                                <span className={getStatusClass(selected.statut || "pending")}>{translateStatus(selected.statut || "pending")}</span>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="py-2 px-4 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                            >
                                Close
                            </button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


function truncate(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function getStatusClass(status) {
    switch (status) {
        case "pending":
            return "px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold";
        case "accepted":
            return "px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold";
        case "rejected":
            return "px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold";
        default:
            return "px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs font-semibold";
    }
}

export default ReservationCard;