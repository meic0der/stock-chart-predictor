import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4010';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, { username, email, password });
      alert('登録成功しました。ログインしてください。');
      navigate('/login'); // 登録後ログインページへ
    } catch (err) {
      alert('登録失敗');
      console.error(err);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2 className="form-title">ユーザー登録</h2>
      <div className="form-group">
        <input className="modern-input" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="modern-input" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="modern-input" type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="modern-btn" style={{ width: '100%' }} onClick={handleRegister}>登録</button>
    </div>
  );
};

export default RegisterForm;
