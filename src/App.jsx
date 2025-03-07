import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchBlock from './components/SearchBlock';
import AdminPanel from './components/admin/AdminPanel';
import News from './components/admin/News';
import Login from './components/admin/Login';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme} className="theme-btn">
          {isDarkMode ? '🌙' : '☀️'}
        </button>
      </div>
      <h1 className="app-title">UserSearch</h1>
      <Routes>
        <Route path="/" element={<SearchBlock />} />
        <Route path="/admin" element={<AdminPanel adminId={1} />} />
        <Route path="/login" element={<Login setAdminId={setAdminId} />} />
        <Route path="/admin/news" element={<News adminId={1} />} />
      </Routes>
      {/* Footer qismi */}
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-text">© {new Date().getFullYear()} FirdavsQ02. Barcha huquqlar himoyalangan.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;