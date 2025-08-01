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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const data = await fetchStockPrediction(symbol, range, model);
      onResult(data);
    } catch (err) {
      console.error("API取得失敗:", err);
      alert("株価予測データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // UIの描画（form）
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: '1.2rem', 
      boxShadow: '0 4px 24px 0 rgba(60, 72, 88, 0.10)',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700', 
          color: '#2d3748',
          margin: '0 0 0.5rem 0'
        }}>
          株価予測分析
        </h2>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1rem',
          margin: '0'
        }}>
          銘柄を入力して、AI予測モデルによる株価予測を取得
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 銘柄入力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '1rem'
          }}>
            銘柄コード
          </label>
          <input
            type="text"
            className="modern-input"
            placeholder="例: AAPL, MSFT, GOOGL"
            value={symbol}
            onChange={handleSymbolChange}
            style={{ 
              fontSize: '1.1rem',
              padding: '1rem',
              borderRadius: '0.8rem',
              border: '2px solid #e2e8f0',
              background: '#f8fafc',
              transition: 'all 0.2s'
            }}
          />
        </div>

        {/* 表示期間選択 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '1rem'
          }}>
            表示期間
          </label>
          <select 
            className="modern-input" 
            value={range} 
            onChange={handleRangeChange} 
            style={{ 
              fontSize: '1rem',
              padding: '1rem',
              borderRadius: '0.8rem',
              border: '2px solid #e2e8f0',
              background: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <option value="1w">1週間</option>
            <option value="1m">1か月</option>
            <option value="1y">1年</option>
            <option value="3y">3年</option>
          </select>
        </div>

        {/* モデル選択 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '1rem'
          }}>
            予測モデル
          </label>
          <select 
            className="modern-input" 
            value={model} 
            onChange={handleModelChange} 
            style={{ 
              fontSize: '1rem',
              padding: '1rem',
              borderRadius: '0.8rem',
              border: '2px solid #e2e8f0',
              background: '#f8fafc',
              cursor: 'pointer'
            }}
          >
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
        </div>

        {/* 送信ボタン */}
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.8rem',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: '1rem',
            transition: 'all 0.2s',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? '分析中...' : '予測分析を開始'}
        </button>
      </form>
    </div>
  );
};

export default StockForm;
