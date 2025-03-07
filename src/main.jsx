import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/admin/Login';
import AdminPanel from './components/admin/AdminPanel';
import './index.css';

function Root() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [adminId, setAdminId] = React.useState(null);

  const handleLogin = (id) => {
    setIsAuthenticated(true);
    setAdminId(id);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />} /> {/* path="/" ni path="*" ga o'zgartirdim */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <AdminPanel adminId={adminId} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);