import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";

import { Route, Routes, useLocation } from "react-router-dom";

import About from "./pages/About.jsx";
import Blogs from "./pages/Blogs.jsx";
import Contact from "./pages/Contact.jsx";
import Creators from "./pages/Creators.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UpdateBlog from "./dashboard/UpdateBlog.jsx";
import Detail from "./pages/Detail.jsx";
import Notfound from "./pages/Notfound.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import { Toaster } from "react-hot-toast";

const App = () => {
  const location = useLocation();

  // Pages where Navbar and Footer should NOT appear
  const hideNavbarFooter = ["/login", "/register"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      {!hideNavbarFooter && <Navbar />}

      {/* Routes */}
      <main className="flex-1">
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/blog/:id" element={<Detail />} />

          {/* ================= PROTECTED ROUTES ================= */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/update/:id"
            element={
              <ProtectedRoute>
                <UpdateBlog />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 ROUTE ================= */}
          <Route path="*" element={<Notfound />} />

        </Routes>
      </main>

      {/* Footer */}
      {!hideNavbarFooter && <Footer />}

      <Toaster />
    </div>
  );
};

export default App;