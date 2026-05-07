import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FloatingAddButton from "../components/FloatingAddButton";

function ServiceDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // ÉTAT POUR LA POP-UP
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/services")
            .then((res) => {
                setServices(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching services:", err);
                setLoading(false);
            });
    }, []);

    const truncate = (text) => text?.length > 80 ? text.substring(0, 80) + "..." : text;

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col relative"> 
                <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800">
                    <Topbar user={user} />
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold">Catalogue des Services</h2>
                        <p className="text-gray-400 text-sm">Cliquez sur un service pour voir les détails</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase border-b border-gray-800">
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr><td colSpan="3" className="p-10 text-center">Chargement...</td></tr>
                                ) : services.map((s) => (
                                    <tr
                                        key={s.id}
                                        onClick={() => setSelectedService(s)} // OUVRIR LA POP-UP
                                        className="hover:bg-gray-800/40 transition-all cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-blue-400 group-hover:text-blue-300">
                                                {s.titre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {truncate(s.description)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-medium text-gray-300 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                                                Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODALE DE DÉTAIL DU SERVICE */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Header Modale */}
                        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-blue-400">{selectedService.titre}</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Détails du service</p>
                            </div>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="text-gray-500 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Corps Modale */}
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</h4>
                                <p className="text-gray-200 leading-relaxed">
                                    {selectedService.description}
                                </p>
                            </div>

                    
                            
                        </div>

                        {/* Footer Modale */}
                        <div className="p-6 bg-gray-800/30 border-t border-gray-800 flex gap-3">
                            <button
                                onClick={() => setSelectedService(null)}
                                className="flex-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition"
                            >
                                Fermer
                            </button>
                            <button
                                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                            >
                                Réserver ce service
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FloatingAddButton />
        </div>
    );
}

export default ServiceDashboard;