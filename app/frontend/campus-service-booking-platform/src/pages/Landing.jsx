import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">

            {/* BACKGROUND GLOW */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-30 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full"></div>

            {/* HEADER */}
            <header className="flex justify-between items-center px-8 py-5 relative z-10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    CampusServices
                </h1>

                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                    >
                        Log in
                    </Link>

                    <Link
                        to="/register"
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition transform"
                    >
                        Sign up
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <main className="flex flex-1 items-center justify-center px-6 relative z-10">
                <div className="max-w-3xl text-center">

                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                        Manage your{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            reservations
                        </span>{" "}
                        easily
                    </h2>

                    <p className="text-gray-400 text-lg mb-10">
                        A modern platform to access campus services quickly and efficiently.
                    </p>

                    <div className="flex items-center justify-center gap-4">


                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-5 py-2.5 text-xl rounded-lg font-semibold shadow hover:scale-105 transition"
                        >
                            🚀 Get Started
                        </Link>
                    </div>

                </div>
            </main>

            {/* FEATURES */}
            <section className="py-15 px-6 relative z-10">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition">
                        <h3 className="text-lg font-semibold mb-2 text-blue-400">
                            Quick booking
                        </h3>
                        <p className="text-gray-400">
                            Book your services in a few clicks.
                        </p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition">
                        <h3 className="text-lg font-semibold mb-2 text-purple-400">
                            Real-time tracking
                        </h3>
                        <p className="text-gray-400">
                            Check your requests easily.
                        </p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-pink-500/20 transition">
                        <h3 className="text-lg font-semibold mb-2 text-pink-400">
                            Easy approval
                        </h3>
                        <p className="text-gray-400">
                            Fast management by administrators.
                        </p>
                    </div>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="text-center pb-5 text-gray-500 text-sm relative z-10">
                © 2026 CampusServices
            </footer>

        </div>
    );
}

export default Landing;
