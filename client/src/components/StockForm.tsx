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
  // 銘柄・期間・モデルのステート
  const [symbol, setSymbol] = useState("");
  const [range, setRange] = useState<"1w" | "1m" | "1y" | "3y">("1w");
  const [model, setModel] = useState("model1");

  // 銘柄入力時の処理（英大文字で自動変換）
  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
  };

  // 期間変更時の処理
  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(e.target.value as "1w" | "1m" | "1y" | "3y");
  };

  // モデル変更時の処理
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
  };

  // フォーム送信時の処理（API呼び出し）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) {
      alert("銘柄を入力してください");
      return;
    }
    try {
      const data = await fetchStockPrediction(symbol, range, model);
      onResult(data);
    } catch (err) {
      console.error("API取得失敗:", err);
      alert("株価予測データの取得に失敗しました");
    }
  };

  // UIの描画（form）
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      {/* 銘柄入力 */}
      <input
        type="text"
        placeholder="例: AAPL"
        value={symbol}
        onChange={handleSymbolChange}
      />

      {/* 表示期間選択 */}
      <label style={{ marginLeft: "1rem" }}>
        表示期間:
        <select value={range} onChange={handleRangeChange}>
          <option value="1w">1週間</option>
          <option value="1m">1か月</option>
          <option value="1y">1年</option>
          <option value="3y">3年</option>
        </select>
      </label>

      {/* モデル選択 */}
      <label style={{ marginLeft: "1rem" }}>
        モデル:
        <select value={model} onChange={handleModelChange}>
          <option value="model1" title="単純な1%成長モデル（統計なし）">
            モデル1（単純成長）
          </option>
          <option
            value="model2"
            title="Support Vector Regression（SVR）を使った機械学習モデル"
          >
            モデル2（ML: SVR）
          </option>
          <option
            value="model3"
            title="XGBoostを使ったより高精度な機械学習モデル"
          >
            モデル3（ML: XGBoost）
          </option>
        </select>
      </label>

      {/* 送信ボタン */}
      <button type="submit" style={{ marginLeft: "1rem" }}>
        検索
      </button>
    </form>
  );
};

export default StockForm;
