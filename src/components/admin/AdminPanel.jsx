import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel({ adminId }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', middle_name: '', passport_id: '', phone_number: '',
    address: '', nationality: '', birth_place: '', citizenship: '', birth_date: '',
    image_url: '', status: 'clean', wanted_reason: '', reason: ''
  });
  const [editId, setEditId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAdminData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search`);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Fetch users error:', error);
      setUsers([]);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/${adminId}`);
      setAdminData({ username: response.data.username, password: '' });
    } catch (error) {
      console.error('Fetch admin data error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${editId}`, { ...formData, adminId });
        setEditId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, { ...formData, adminId });
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        data: { adminId, reason: formData.reason },
      });
      fetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
  };

  const resetForm = () => {
    setFormData({
      first_name: '', last_name: '', middle_name: '', passport_id: '', phone_number: '',
      address: '', nationality: '', birth_place: '', citizenship: '', birth_date: '',
      image_url: '', status: 'clean', wanted_reason: '', reason: ''
    });
    setEditId(null);
  };

  const handleSaveAdmin = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/${adminId}`, adminData);
      setSettingsOpen(false);
    } catch (error) {
      console.error('Save admin error:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const closeSettings = (e) => {
    if (e.target.className === 'settings-modal') setSettingsOpen(false);
  };

  const closeSearchModal = (e) => {
    if (e.target.className === 'search-modal') setSearchModalOpen(false);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search`, {
        params: { passport_id: searchQuery },
      });
      setSearchResults(response.data);
      setSearchModalOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchModalOpen(true);
    }
  };

  return (
    <div className={`admin-panel ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme} className="theme-btn">{isDarkMode ? '🌙' : '☀️'}</button>
      </div>
      <h2 className="admin-title">Admin Panel</h2>
      <button className="settings-btn" onClick={() => setSettingsOpen(true)}>⚙️</button>

      <div className="search-block">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Passport ID bo‘yicha qidirish"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">Qidirish</button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Ism" required />
          <input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Familiya" required />
          <input name="middle_name" value={formData.middle_name} onChange={handleInputChange} placeholder="Otasining ismi" />
          <input name="passport_id" value={formData.passport_id} onChange={handleInputChange} placeholder="Passport ID" required />
          <input name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Telefon raqami" />
          <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Yashash joyi" />
          <input name="nationality" value={formData.nationality} onChange={handleInputChange} placeholder="Millati" />
          <input name="birth_place" value={formData.birth_place} onChange={handleInputChange} placeholder="Tug‘ilgan joyi" />
          <input name="citizenship" value={formData.citizenship} onChange={handleInputChange} placeholder="Fuqaroligi" />
          <input name="birth_date" type="date" value={formData.birth_date} onChange={handleInputChange} placeholder="Tug‘ilgan sana" />
          <input name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="Rasm URL (Cloudinary)" />
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="clean">Toza</option>
            <option value="wanted">Qidiruvda</option>
          </select>
          <input
            name="wanted_reason"
            value={formData.wanted_reason}
            onChange={handleInputChange}
            placeholder="Qidiruv sababi"
            disabled={formData.status === 'clean'}
          />
          <input
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Amal sababi (ixtiyoriy)"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">{editId ? 'Yangilash' : 'Qo`shish'}</button>
          {editId && <button type="button" onClick={resetForm} className="cancel-btn">Bekor qilish</button>}
        </div>
      </form>

      <div className="user-table-container">
        <h3>Foydalanuvchilar</h3>
        {users.length > 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Passport ID</th>
                <th>Status</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.image_url ? <img src={user.image_url} alt="User" className="user-icon" /> : <span className="no-image">🖼️</span>}
                  </td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.passport_id}</td>
                  <td className={user.status === 'clean' ? 'status-clean' : 'status-wanted'}>
                    {user.status === 'clean' ? 'Toza' : 'Qidiruvda'}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(user)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(user.id)} className="delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-users">Foydalanuvchilar topilmadi.</p>
        )}
      </div>

      {settingsOpen && (
        <div className="settings-modal" onClick={closeSettings}>
          <div className={`settings-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h3>Admin Sozlamalari</h3>
            <div className="admin-info">
              <input
                type="text"
                name="username"
                value={adminData.username}
                onChange={handleAdminInputChange}
                placeholder="Foydalanuvchi nomi"
                className="admin-input"
              />
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={adminData.password}
                  onChange={handleAdminInputChange}
                  placeholder="Yangi parol (bo‘sh qoldirsa o‘zgarmaydi)"
                  className="admin-input"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>
            <div className="settings-actions">
              <button onClick={handleSaveAdmin} className="save-btn">Saqlash</button>
              <button onClick={() => setSettingsOpen(false)} className="close-btn">Yopish</button>
            </div>
          </div>
        </div>
      )}


<div className="admin-panel">
  <div className="theme-toggle">
    <button onClick={toggleTheme} className="theme-btn">{isDarkMode ? '🌙' : '☀️'}</button>
  </div>
  <h2 className="admin-title">Admin Panel</h2>
  <button className="settings-btn" onClick={() => setSettingsOpen(true)}>⚙️</button>
  <Link to="/admin/news">
    <button className="news-btn">Yangiliklar</button>
  </Link>

  {/* Qolgan kod o‘zgarishsiz */}
</div>






      {searchModalOpen && (
        <div className="search-modal" onClick={closeSearchModal}>
          <div className={`search-modal-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h3>Qidiruv Natijalari</h3>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="search-result">
                  <div className="result-header">
                    {result.image_url ? (
                      <img src={result.image_url} alt="User" className="result-image" />
                    ) : (
                      <span className="no-image">🖼️</span>
                    )}
                    <div className="result-info">
                      <p><strong>F.I.O:</strong> {result.first_name} {result.middle_name} {result.last_name}</p>
                      <p><strong>Passport ID:</strong> {result.passport_id}</p>
                      <p><strong>Fuqaroligi:</strong> {result.citizenship || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="result-log">
                    <p><strong>Amal:</strong> {result.action || 'Noma`lum'}</p>
                    <p><strong>Sana:</strong> {result.action_date ? new Date(result.action_date).toLocaleString() : 'N/A'}</p>
                    <p><strong>Admin ID:</strong> {result.admin_id || 'N/A'}</p>
                    {result.log_reason && <p><strong>Sabab:</strong> {result.log_reason}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">Hech narsa topilmadi.</p>
            )}
            <button onClick={() => setSearchModalOpen(false)} className="close-btn">Yopish</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;