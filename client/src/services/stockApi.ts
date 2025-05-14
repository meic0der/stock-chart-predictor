// src/services/stockApi.ts
// client/src/services/stockApi.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// services/stockApi.ts
//axios.post(URL, data) data:POST の body に入るオブジェクト（JSON.stringify() された状態で送られる）
export const fetchStockPrediction = async (symbol: string, range: '1w' | '1m') => {
  const res = await axios.post(`${API_BASE_URL}/api/predict`, { symbol, range });
  return res.data;
};


export const fetchHistory = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/history`);
  return res.data;
};

// ✅ メモを更新（PATCH）
export const updateNote = async (id: number, note: string) => {
  await axios.patch(`${API_BASE_URL}/api/history/${id}`, { note });
};



// ✅ 履歴を削除（DELETE）
export const deleteHistory = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/api/history/${id}`);
};