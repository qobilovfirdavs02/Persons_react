import { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
        username,
        password,
      });
      onLogin(response.data.adminId);
    } catch (err) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Admin Kirish</h2>
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Foydalanuvchi nomi"
            className="login-input"
          />
          <span className="input-icon">👤</span>
        </div>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            className="login-input"
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-btn">Kirish</button>
      </form>
    </div>
  );
}

export default Login;