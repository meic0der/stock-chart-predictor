import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { StockData } from "../types"; // ✅ 共通型を使うと他でも再利用できる

type Props = {
  data: StockData;
};

// 移動平均（SMA）を計算する関数
const calculateSMA = (
  data: number[],
  windowSize: number
): (number | null)[] => {
  return data.map((_, i) => {
    if (i < windowSize - 1) return null;
    const window = data.slice(i - windowSize + 1, i + 1);
    const sum = window.reduce((a, b) => a + b, 0);
    return +(sum / window.length).toFixed(2);
  });
};

const StockChart: React.FC<Props> = ({ data }) => {
  const { actual, actualDates, predicted, predictedDates, company } = data;

  // 移動平均の対象日数（初期は3日）
  const [smaPeriod, setSmaPeriod] = useState(3);

  // 移動平均の値を計算
  const sma = calculateSMA(actual, smaPeriod);

  // 実データと日付を結合（チャート描画用）
  const actualPoints = actualDates.map((date, i) => ({
    date,
    actual: actual[i] ?? null,
    predicted: null, // 実データ側には予測なし
    sma: sma[i] ?? null, // 移動平均
  }));

  // 予測データと未来の日付を結合（チャート描画用）
  const predictedPoints = predictedDates.map((date, i) => ({
    date,
    actual: null, // 予測側には実データなし
    predicted: predicted[i] ?? null,
    sma: null, // 予測にはSMA表示しない
  }));

  // 実データと予測を1本のチャートにまとめる
  const chartData = [...actualPoints, ...predictedPoints];

  return (
    <div style={{ width: '100%', height: 420 }}>
      {/* 企業情報（ある場合のみ表示） */}
      {company && (
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>{company.name}</strong>（{company.exchange} / {company.currency}）
        </div>
      )}

      {/* 移動平均の期間切り替えセレクト */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          移動平均期間:{' '}
          <select value={smaPeriod} onChange={(e) => setSmaPeriod(Number(e.target.value))}>
            <option value={3}>3日</option>
            <option value={5}>5日</option>
            <option value={7}>7日</option>
          </select>
        </label>
      </div>

      {/* 実データ・予測・SMAの3本線チャート */}
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="actual" stroke="#8884d8" name="実データ" />
          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="予測" />
          <Line
            type="monotone"
            dataKey="sma"
            stroke="#ff7300"
            name={`移動平均（${smaPeriod}日）`}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
