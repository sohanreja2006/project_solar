import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserLogin from './pages/user/UserLogin';
import UserSignup from './pages/user/UserSignup';
import UserDashboard from './pages/user/UserDashboard';
import ForgotPassword from './pages/user/ForgotPassword';
import { UserAuthProvider } from './context/UserAuthContext';

const HIDE_SHELL_PATHS = ['/admin', '/login', '/signup', '/dashboard', '/forgot-password'];

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const hideShell = HIDE_SHELL_PATHS.some((p) => location.pathname.startsWith(p));

  return (
    <>
      <ScrollToTop />
      {!hideShell && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* User Auth & Dashboard */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Portal */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserAuthProvider>
        <AppLayout />
      </UserAuthProvider>
    </BrowserRouter>
  );
}
