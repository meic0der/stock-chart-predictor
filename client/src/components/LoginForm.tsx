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
    <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2 className="form-title">ログイン</h2>
      <div className="form-group">
        <input className="modern-input" placeholder="ユーザー名" value={username} onChange={(e) => setUserName(e.target.value)} />
        <input className="modern-input" type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="modern-btn" style={{ width: '100%' }} onClick={handleLogin}>ログイン</button>
      <p style={{ marginTop: '1.2rem', textAlign: 'center' }}>
        ユーザー登録は <Link className="form-link" to="/register">こちら</Link>
      </p>
    </div>
  );
};

export default LoginForm;
