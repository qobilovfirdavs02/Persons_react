import { useState, useEffect } from 'react';
import axios from 'axios';
import './News.css';

function News({ adminId }) {
  const [newsData, setNewsData] = useState({ title: '', content: '', image_url: '', video_url: '' });
  const [newsList, setNewsList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState(null); // Tahrirlanayotgan yangilik ID’si
  const [editData, setEditData] = useState({ title: '', content: '', image_url: '', video_url: '' }); // Tahrir formasi uchun

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`);
      setNewsList(response.data);
    } catch (error) {
      console.error('Fetch news error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/news`, { ...newsData, adminId });
      fetchNews();
      setNewsData({ title: '', content: '', image_url: '', video_url: '' });
    } catch (error) {
      console.error('Submit news error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error('Delete news error:', error);
    }
  };

  const handleEditClick = (news) => {
    setEditingNewsId(news.id);
    setEditData({
      title: news.title,
      content: news.content,
      image_url: news.image_url || '',
      video_url: news.video_url || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/news/${editingNewsId}`, editData);
      fetchNews();
      setEditingNewsId(null); // Tahrirlashni yakunlash
      setEditData({ title: '', content: '', image_url: '', video_url: '' });
    } catch (error) {
      console.error('Edit news error:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`news-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button onClick={toggleTheme} className="theme-btn">
        {isDarkMode ? '🌙' : '☀️'}
      </button>
      <h2>Yangiliklar Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="news-form">
        <input
          type="text"
          name="title"
          value={newsData.title}
          onChange={handleInputChange}
          placeholder="Sarlavha"
          className="news-input"
          required
        />
        <textarea
          name="content"
          value={newsData.content}
          onChange={handleInputChange}
          placeholder="Matn"
          className="news-textarea"
          required
        />
        <input
          type="text"
          name="image_url"
          value={newsData.image_url}
          onChange={handleInputChange}
          placeholder="Rasm URL (ixtiyoriy)"
          className="news-input"
        />
        <input
          type="text"
          name="video_url"
          value={newsData.video_url}
          onChange={handleInputChange}
          placeholder="Video URL (ixtiyoriy)"
          className="news-input"
        />
        <button type="submit" className="submit-btn">Qo‘shish</button>
      </form>

      <div className="news-list">
        <h3>Barcha Yangiliklar</h3>
        {newsList.map((news) => (
          <div key={news.id} className="news-item">
            {editingNewsId === news.id ? (
              // Tahrirlash formasi
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  placeholder="Sarlavha"
                  className="news-input"
                  required
                />
                <textarea
                  name="content"
                  value={editData.content}
                  onChange={handleEditChange}
                  placeholder="Matn"
                  className="news-textarea"
                  required
                />
                <input
                  type="text"
                  name="image_url"
                  value={editData.image_url}
                  onChange={handleEditChange}
                  placeholder="Rasm URL (ixtiyoriy)"
                  className="news-input"
                />
                <input
                  type="text"
                  name="video_url"
                  value={editData.video_url}
                  onChange={handleEditChange}
                  placeholder="Video URL (ixtiyoriy)"
                  className="news-input"
                />
                <button type="submit" className="save-btn">Saqlash</button>
                <button type="button" onClick={() => setEditingNewsId(null)} className="cancel-btn">
                  Bekor qilish
                </button>
              </form>
            ) : (
              // Oddiy ko‘rinish
              <>
                <h4>{news.title}</h4>
                <p>{news.content}</p>
                {news.image_url && <img src={news.image_url} alt={news.title} className="news-image" />}
                {news.video_url && (
                  <video controls className="news-video">
                    <source src={news.video_url} type="video/mp4" />
                    Video qo‘llab-quvvatlanmaydi.
                  </video>
                )}
                <button onClick={() => handleEditClick(news)} className="edit-btn">Tahrirlash</button>
                <button onClick={() => handleDelete(news.id)} className="delete-btn">O‘chirish</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;