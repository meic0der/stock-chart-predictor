import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
    <div>
      <h2>ユーザー登録</h2>
      <input placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>登録</button>
    </div>
  );
};

export default RegisterForm;
