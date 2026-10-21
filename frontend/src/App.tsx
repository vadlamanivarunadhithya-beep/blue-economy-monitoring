import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MarineResources from "./pages/MarineResources";
import Fisheries from "./pages/Fisheries";
import Industries from "./pages/Industries";
import EconomicIndicators from "./pages/EconomicIndicators";
import Alerts from "./pages/Alerts";

function ProtectedLayout() {
const token = localStorage.getItem("token");

if (!token) {
return <Navigate to="/login" replace />;
}

return ( <div className="app-layout"> <Sidebar />


  <main className="main-area">
    <Header />

    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/marine-resources" element={<MarineResources />} />
      <Route path="/fisheries" element={<Fisheries />} />
      <Route path="/industries" element={<Industries />} />
      <Route path="/economic-indicators" element={<EconomicIndicators />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </main>
</div>


);
}

function App() {
const [ready, setReady] = useState(false);

useEffect(() => {
// Clear the previous login whenever the application starts.
localStorage.removeItem("token");
localStorage.removeItem("user");


setReady(true);


}, []);

if (!ready) {
return <div>Loading...</div>;
}

return ( <BrowserRouter> <Routes>
<Route path="/login" element={<Login />} />
<Route path="/*" element={<ProtectedLayout />} /> </Routes> </BrowserRouter>
);
}

export default App;
