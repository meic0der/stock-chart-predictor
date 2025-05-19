import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { HistoryItem } from "../types";


type Props = {
  data: HistoryItem[];
};


const CompareChart: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return <p>比較対象が選択されていません</p>;

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

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.map((item, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={`${item.symbol}-${item.model}`}
            stroke={`hsl(${index * 50}, 70%, 50%)`}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CompareChart;
