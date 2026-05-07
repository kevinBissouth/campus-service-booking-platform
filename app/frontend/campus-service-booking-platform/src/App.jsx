import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";





function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      {/* futures routes */}
      {/* /login */}
      {/* /register */}
    </Routes>
  );
}

export default App;