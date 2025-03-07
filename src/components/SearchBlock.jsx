import { useState, useEffect } from 'react';
import axios from 'axios';
import UserModal from './UserModal';
import './SearchBlock.css';

function SearchBlock() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`);
      setNewsList(response.data);
    } catch (error) {
      console.error('Fetch news error:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search`, {
        params: { name: searchQuery },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setUsers([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2) handleSearch();
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`search-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="search-block">
        <button onClick={toggleTheme} className="theme-btn">
          {isDarkMode ? '🌙' : '☀️'}
        </button>
        <h2>Foydalanuvchi qidirish</h2>
        <div className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Ism, familiya yoki passport ID bo‘yicha qidiring"
            className="search-input"
          />
        </div>
        {users.length > 0 && (
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id} onClick={() => setSelectedUser(user)} className="user-item">
                <span className="user-name">{user.first_name} {user.last_name}</span>
                <span className="user-passport">{user.passport_id}</span>
              </li>
            ))}
          </ul>
        )}
        {selectedUser && (
          <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} isDarkMode={isDarkMode} />
        )}
      </div>

      <div className="news-block">
        <h2>Yangiliklar</h2>
        <div className="news-content">
          {newsList.length > 0 ? (
            newsList.map((news) => (
              <div key={news.id} className="news-item">
                <h3>{news.title}</h3>
                <p>{news.content}</p>
                {news.image_url && <img src={news.image_url} alt={news.title} className="news-image" />}
                {news.video_url && (
                  <video controls className="news-video">
                    <source src={news.video_url} type="video/mp4" />
                    Video qo‘llab-quvvatlanmaydi.
                  </video>
                )}
              </div>
            ))
          ) : (
            <p>Yangiliklar hali yo‘q.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBlock;