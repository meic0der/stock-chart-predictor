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
    <div style={{ 
      background: '#fff', 
      borderRadius: '1.2rem', 
      boxShadow: '0 4px 24px 0 rgba(60, 72, 88, 0.10)',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      {/* ヘッダー部分 */}
      <div style={{ 
        marginBottom: '1.5rem',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '1rem'
      }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: '#2d3748',
          margin: '0 0 0.5rem 0'
        }}>
          株価チャート分析
        </h3>
        {company && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#64748b',
            fontSize: '1rem'
          }}>
            <span style={{ fontWeight: '600' }}>{company.name}</span>
            <span>•</span>
            <span>{company.exchange}</span>
            <span>•</span>
            <span>{company.currency}</span>
          </div>
        )}
      </div>

      {/* 移動平均の期間切り替えセレクト */}
      <div style={{ 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '0.8rem',
        border: '1px solid #e2e8f0'
      }}>
        <label style={{ 
          fontWeight: '600', 
          color: '#374151',
          fontSize: '1rem'
        }}>
          移動平均期間:
        </label>
        <select
          className="modern-input"
          value={smaPeriod}
          onChange={(e) => setSmaPeriod(Number(e.target.value))}
          style={{ 
            minWidth: 100,
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          <option value={3}>3日</option>
          <option value={5}>5日</option>
          <option value={7}>7日</option>
        </select>
      </div>

      {/* 実データ・予測・SMAの3本線チャート */}
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#6366f1"
              strokeWidth={2}
              name="実データ"
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={2}
              name="予測"
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="sma"
              stroke="#f59e0b"
              strokeWidth={2}
              name={`移動平均（${smaPeriod}日）`}
              dot={false}
              activeDot={{ r: 5, stroke: '#f59e0b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 凡例 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem',
        marginTop: '1rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: '#6366f1', 
            borderRadius: '50%' 
          }}></div>
          <span style={{ fontSize: '0.9rem', color: '#374151' }}>実データ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: '#10b981', 
            borderRadius: '50%' 
          }}></div>
          <span style={{ fontSize: '0.9rem', color: '#374151' }}>予測</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: '#f59e0b', 
            borderRadius: '50%' 
          }}></div>
          <span style={{ fontSize: '0.9rem', color: '#374151' }}>移動平均</span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
