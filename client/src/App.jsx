import { Link, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import MyEnquiries from "./pages/MyEnquiries";
import ReceivedEnquiries from "./pages/ReceivedEnquiries";
import AdminDashboard from "./pages/AdminDashboard";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";

function ProfilePage() {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <h2>My Profile</h2>
      <pre style={{ background: "#1111", padding: 12, overflow: "auto" }}>
        {JSON.stringify(user, null, 2)}
      </pre>
      <Link to="/">Back</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars/:id" element={<CarDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<RequireAuth />}>
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/my-enquiries" element={<MyEnquiries />} />
        <Route path="/received-enquiries" element={<ReceivedEnquiries />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/compare" element={<Compare />} />
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
