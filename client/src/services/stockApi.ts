// src/services/stockApi.ts
// client/src/services/stockApi.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// const API_BASE_URL ="https://stock-chart-predictor.onrender.com"

// const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

/**
 * 株価予測（Node/Express 側 API）
 * @param symbol 銘柄コード（例: AAPL）
 * @param range 表示範囲（'1w' | '1m' など）
 */
export const fetchStockPrediction = async (
  symbol: string,
  range: '1w' | '1m' | '1y' | '3y',
  model: string
) => {
  const res = await axios.post(`${API_BASE_URL}/api/predict`, {
    symbol,
    range,
    model
  });
  return res.data;
};

/**
 * 履歴一覧を取得
 */
export const fetchHistory = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/history`);
  return res.data;
};

/**
 * 履歴のメモを更新
 */
export const updateNote = async (id: number, note: string) => {
  await axios.patch(`${API_BASE_URL}/api/history/${id}`, { note });
};

/**
 * 履歴を削除
 */
export const deleteHistory = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/api/history/${id}`);
};

// /**
//  * 機械学習モデルによる予測（Flask API）
//  * @param prev_close 前日の終値
//  * @param return_rate 期待リターン（例: 0.01 = +1%）
//  */
// export const fetchMLPrediction = async (prev_close: number, return_rate: number) => {
//   const res = await axios.post(`${ML_API_BASE_URL}/predict`, {
//     prev_close,
//     return: return_rate,
//   });
//   return res.data.predicted;
// };

// /**
//  * モデル名を指定して ML 予測（複数モデル対応）
//  * @param symbol 銘柄
//  * @param model モデル名（例: "model1", "model2"）
//  */
// export const fetchModelPrediction = async (symbol: string, model: string) => {
//   const res = await axios.post(`${ML_API_BASE_URL}/predict`, {
//     symbol,
//     model,
//   });
//   return res.data;
// };