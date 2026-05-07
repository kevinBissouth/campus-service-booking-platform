import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceDashboard from "./pages/ServiceDashboard";





function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/services" element={<ServiceDashboard />} />
    </Routes>
  );
}

export default App;