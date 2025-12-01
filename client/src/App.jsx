import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import MyRequests from './pages/employee/MyRequests';
import Profile from './pages/employee/Profile';
import ManagerDashboard from './pages/manager/Dashboard';
import PendingRequests from './pages/manager/PendingRequests';
import AllRequests from './pages/manager/AllRequests';
import { fetchProfile } from './features/authSlice';

const Landing = () => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  const destination = user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard';
  return <Navigate to={destination} replace />;
};

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/apply" element={<ApplyLeave />} />
            <Route path="/employee/requests" element={<MyRequests />} />
            <Route path="/employee/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/pending" element={<PendingRequests />} />
            <Route path="/manager/requests" element={<AllRequests />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
