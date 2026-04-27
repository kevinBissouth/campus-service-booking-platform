import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState("Chargement...");
  const [loading, setLoading] = useState(false);

  // URL de base de ton API FastAPI
  const API_URL = "http://127.0.0.1:8000/api";

  // Charger le message de bienvenue au démarrage
  useEffect(() => {
    fetchWelcome();
  }, []);

  const fetchWelcome = async () => {
    try {
      const response = await axios.get(`${API_URL}/welcome`);
      setMessage(response.data.text);
    } catch (error) {
      setMessage("Erreur de connexion au serveur");
    }
  };

  const fetchGoodbye = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/goodbye`);
      setMessage(response.data.text);
    } catch (error) {
      setMessage("Impossible de dire au revoir...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center max-w-md w-full">

        <h1 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">
          Statut de l'API
        </h1>

        <p className="text-2xl font-semibold mb-8 h-16 flex items-center justify-center">
          {message}
        </p>

        <button
          onClick={fetchGoodbye}
          disabled={loading}
          className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Appel en cours..." : "Cliquer sur GO !"}
        </button>

        <button
          onClick={fetchWelcome}
          className="block mt-4 text-xs text-slate-400 hover:text-white underline mx-auto"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default App;
