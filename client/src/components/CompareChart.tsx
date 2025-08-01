import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { HistoryItem } from "../types";


type Props = {
  data: HistoryItem[];
};


const CompareChart: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div style={{ 
        background: '#fff', 
        borderRadius: '1.2rem', 
        boxShadow: '0 4px 24px 0 rgba(60, 72, 88, 0.10)',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ 
          color: '#64748b', 
          fontSize: '1.1rem',
          padding: '2rem'
        }}>
          📊 比較対象が選択されていません
        </div>
      </div>
    );
  }

  // 日付ごとに比較用データを整形
  const chartData: { date: string; [key: string]: number | string }[] = [];

  const maxLength = Math.max(...data.map(d => d.predicted.length));
  for (let i = 0; i < maxLength; i++) {
    const row: { date: string; [key: string]: number | string } = {
      date: data[0].predictedDates[i] || `+${i + 1}日`
    };
    data.forEach((item, idx) => {
      row[`${item.symbol}-${item.model}`] = item.predicted[i];
    });
    chartData.push(row);
  }

  // 色のパレット
  const colors = [
    '#6366f1', // インディゴ
    '#10b981', // エメラルド
    '#f59e0b', // アンバー
    '#ef4444', // レッド
    '#8b5cf6', // バイオレット
    '#06b6d4', // シアン
    '#84cc16', // ライム
    '#f97316', // オレンジ
  ];

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
          予測比較分析
        </h3>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1rem',
          margin: '0'
        }}>
          選択された銘柄の予測値を比較表示
        </p>
      </div>

      {/* 選択された銘柄の情報 */}
      <div style={{ 
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '0.8rem',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem',
          justifyContent: 'center'
        }}>
          {data.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#fff',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: colors[index % colors.length], 
                borderRadius: '50%' 
              }}></div>
              <span style={{ 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                {item.symbol}
              </span>
              <span style={{ 
                color: '#64748b',
                fontSize: '0.8rem'
              }}>
                ({item.model})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 比較チャート */}
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
            <Legend 
              wrapperStyle={{
                paddingTop: '1rem'
              }}
            />
            {data.map((item, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={`${item.symbol}-${item.model}`}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                name={`${item.symbol} (${item.model})`}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: colors[index % colors.length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 統計情報 */}
      <div style={{ 
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '0.8rem',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ 
          fontSize: '1.1rem', 
          fontWeight: '600', 
          color: '#374151',
          margin: '0 0 1rem 0'
        }}>
          比較統計
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            padding: '0.75rem',
            background: '#fff',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
              比較対象数
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748' }}>
              {data.length}件
            </div>
          </div>
          <div style={{ 
            padding: '0.75rem',
            background: '#fff',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
              予測期間
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748' }}>
              {maxLength}日間
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareChart;
