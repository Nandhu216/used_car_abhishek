import { Link, Route, Routes, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import RequireSeller from "./components/RequireSeller";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import MyEnquiries from "./pages/MyEnquiries";
import MyBids from "./pages/MyBids";
import MyOrders from "./pages/MyOrders";
import ReceivedEnquiries from "./pages/ReceivedEnquiries";
import ReceivedBids from "./pages/ReceivedBids";
import SellerDeliveries from "./pages/SellerDeliveries";
import SellerDamageReports from "./pages/SellerDamageReports";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminPaymentManagement from "./pages/AdminPaymentManagement";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";

function MarketplaceLayout() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">My profile</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Back
        </Link>
      </div>
      <div className="card">
        <div className="card-body">
          <dl className="row mb-0 small">
            <dt className="col-sm-3 text-muted-app">Name</dt>
            <dd className="col-sm-9">{user?.name}</dd>
            <dt className="col-sm-3 text-muted-app">Email</dt>
            <dd className="col-sm-9">{user?.email}</dd>
            <dt className="col-sm-3 text-muted-app">Phone</dt>
            <dd className="col-sm-9">{user?.phoneNumber || "—"}</dd>
            <dt className="col-sm-3 text-muted-app">Role</dt>
            <dd className="col-sm-9">
              <span className="badge bg-primary">{user?.role}</span>
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MarketplaceLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/my-enquiries" element={<MyEnquiries />} />
          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<Compare />} />
        </Route>
        <Route element={<RequireSeller />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/received-enquiries" element={<ReceivedEnquiries />} />
          <Route path="/received-bids" element={<ReceivedBids />} />
          <Route path="/seller-deliveries" element={<SellerDeliveries />} />
          <Route path="/seller-damage-reports" element={<SellerDamageReports />} />
        </Route>
      </Route>
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="cars" element={<AdminDashboard />} />
          <Route path="enquiries" element={<AdminDashboard />} />
          <Route path="bids" element={<AdminDashboard />} />
          <Route path="payments" element={<AdminPaymentManagement />} />
          <Route path="deliveries" element={<AdminDashboard />} />
          <Route path="damage-reports" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
