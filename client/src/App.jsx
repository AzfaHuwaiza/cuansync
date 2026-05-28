import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/login";
import { ProtectedRoute,PublicRoute,AdminRoute } from "./components/protectedRoter";
import Register from "./page/register";
import { getIdUser, getRole } from "./utils/authStorage";
import { Navigate } from "react-router-dom";

import Transactions from "./page/transaction";


import UmkmUser from "./page/umkmUser";

import Dashboard from "./page/dashboard";
import AdminDashboard from "./page/adminDashboard";
import LaporanTransaksi from "./page/laporanTransaksi";
import ProductUser from "./page/productUser";
import AllUmkm from "./page/allUmkm";
import KonsultasiAi from "./page/konsultasiAi";
import DirektoryUMKM from "./page/direktoryUmkm";
import DaftarPengguna from "./page/daftarPengguna";
import ProfileUser from "./page/profileUser";






const RootGate = () => {
  return getIdUser() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

const HomeGate = () => {
  const role = getRole();
  return role === "admin" ? (
    <Navigate to="/adminDashboard" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RootGate />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>

            <Route path="/home" element={<HomeGate />} />

            <Route path="/productUser" element={<ProductUser />} />

            <Route element={<AdminRoute />}>
              <Route path="/adminDashboard" element={<AdminDashboard />} />
              <Route path="/direktoryUmkm" element={<DirektoryUMKM />} />
              <Route path="/daftarPengguna" element={<DaftarPengguna />} />
            </Route>

            <Route path="/konsultasiAi" element={<KonsultasiAi />} />
            <Route path="/laporanTransaksi" element={<LaporanTransaksi />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions/:id" element={<Transactions />} />
            <Route path="/profile" element={<ProfileUser />} />

            <Route path="/allumkm" element={<AllUmkm />} />
            <Route path="/umkmUser" element={<UmkmUser />} />




          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
