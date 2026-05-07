import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ReservationCard from "../components/ReservationCard";
import FloatingAddButton from "../components/FloatingAddButton";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/bookings")
            .then((res) => {
                console.log("Reservations from API:", res.data);
                setReservations(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Error fetching reservations:", err);
                setReservations([]);
            });
    }, []);

    // FILTRER L'UTILISATEUR
    const userReservations = reservations.filter((r) => {
        const studentId = typeof r.etudiant === "object" ? r.etudiant?.id : r.etudiant;
        const currentUserId = Number(user.id);
        console.log(`Comparing: studentId=${studentId}, userId=${currentUserId}`);
        return studentId === currentUserId;
    });

    const ongoing = userReservations.filter(r => r.statut === "pending");
    const current = userReservations.filter(r => r.statut === "accepted");
    const past = userReservations.filter(r => r.statut === "rejected");

    return (
        <div className="flex h-screen bg-gray-950 text-white">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* TOPBAR FIX */}
                <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800">
                    <Topbar user={user} />
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

                    {/* HEADER */}
                    <div>
                        <h2 className="text-2xl font-bold">
                            Dashboard
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Overview of your reservations
                        </p>
                    </div>

                    {/* CARDS */}
                    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-4xl mx-auto">

                        {/* ONGOING */}
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-2 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center justify-between">
                                <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                    Pending
                                </h3>

                                <div className="text-orange-400 text-sm">
                                    ⏳
                                </div>
                            </div>

                            <p className="text-2xl font-bold text-orange-400 mt-2">
                                {ongoing.length}
                            </p>

                            <p className="text-[10px] text-gray-500 mt-1">
                                Waiting for validation
                            </p>

                        </div>

                        {/* CURRENT */}
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-2 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center justify-between">
                                <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                    Approved
                                </h3>

                                <div className="text-green-400 text-sm">
                                    ✔️
                                </div>
                            </div>

                            <p className="text-2xl font-bold text-green-400 mt-2">
                                {current.length}
                            </p>

                            <p className="text-[10px] text-gray-500 mt-1">
                                Accepted reservations
                            </p>

                        </div>

                        {/* PAST */}
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-2 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center justify-between">
                                <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                    Rejected
                                </h3>

                                <div className="text-red-400 text-sm">
                                    ❌
                                </div>
                            </div>

                            <p className="text-2xl font-bold text-red-400 mt-2">
                                {past.length}
                            </p>

                            <p className="text-[10px] text-gray-500 mt-1">
                                Rejected reservations
                            </p>

                        </div>

                    </div>

                    {/* RESERVATIONS TABLE */}
                    <ReservationCard />

                </div>

            </div>

            {/* FLOAT BUTTON */}
            <FloatingAddButton />

        </div>
    );
}

export default Dashboard;