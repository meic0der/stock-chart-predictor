// ReactとuseStateフックをインポート
import React, { useState } from "react";
// API呼び出し関数
import { fetchStockPrediction } from "../services/stockApi";
// StockData型を型だけインポート（verbatimModuleSyntax対応）
import type { StockData } from "../types";

// 親コンポーネントから受け取るpropsの型
type Props = {
  onResult: (data: StockData) => void; // 取得結果を親に渡すコールバック
};

// コンポーネント本体（React.FC＝Functional Component）
const StockForm: React.FC<Props> = ({ onResult }) => {
  // ユーザーが入力する株式シンボル（例: AAPL）
  const [symbol, setSymbol] = useState("");
  // 表示期間（1週間 or 1か月）
  const [range, setRange] = useState<"1w" | "1m">("1w");

  // 銘柄入力時の処理（英大文字で自動変換）
  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
  };

  // 表示期間（ドロップダウン）変更時の処理
  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(e.target.value as "1w" | "1m");
  };

  // フォーム送信時の処理（予測API呼び出し）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ページリロード抑制
    if (!symbol) {
      alert('銘柄を入力してください');
      return;
    }
    try {
      const data = await fetchStockPrediction(symbol, range); // API呼び出し
      onResult(data); // 親コンポーネントに結果を渡す
    } catch (err) {
      console.error('API取得失敗:', err);
      alert('株価予測データの取得に失敗しました');
    }
  };

  // UIの描画（form）
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      {/* 銘柄入力欄 */}
      <input
        type="text"
        placeholder="例: AAPL"
        value={symbol}
        onChange={handleSymbolChange}
      />
      {/* 期間選択 */}
      <label style={{ marginLeft: '1rem' }}>
        表示期間:
        <select value={range} onChange={handleRangeChange}>
          <option value="1w">1週間</option>
          <option value="1m">1か月</option>
        </select>
      </label>
      {/* 検索ボタン */}
      <button type="submit" style={{ marginLeft: '1rem' }}>
        検索
      </button>
    </form>
  );
};


export default StockForm;
