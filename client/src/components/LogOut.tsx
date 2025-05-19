import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {});
      alert('ログアウトしました');
      window.location.href = '/';
    } catch (err) {
      console.error('ログアウト失敗', err);
    }
  };

  return <button onClick={handleLogout}>ログアウト</button>;
};

export default LogoutButton;
