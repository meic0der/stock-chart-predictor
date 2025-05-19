import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';


const LoginForm: React.FC = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      navigate('/app'); // ログイン後にAppに遷移
    } catch (err) {
      alert('ログイン失敗');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <input placeholder="ユーザー名" value={username} onChange={(e) => setUserName(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>ログイン</button>
      <p>
        ユーザー登録は <Link to="/register">こちら</Link>
      </p>
    </div>
  );
};

export default LoginForm;
