import { useState } from "react";
import StockForm from "./components/StockForm";
import StockChart from "./components/StockChart";
import HistoryList from "./components/HistoryList";
import type { StockData } from "./types"; // ✅ 型は共通ファイルからインポート

function App() {
  // 株価予測＆実データを保持する状態（初期はnull）
  const [stockData, setStockData] = useState<StockData | null>(null);

  // フォームで予測を取得した結果を受け取る
  const handleResult = (data: StockData) => {
    setStockData(data);
  };

  // 履歴のアイテムがクリックされた時の処理
  const handleHistorySelect = (item: StockData) => {
    setStockData({
      actual: item.actual,
      actualDates: item.actualDates,
      predicted: item.predicted,
      predictedDates: item.predictedDates,
      company: item.company,
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📈 株価予測アプリ</h1>

      {/* 検索フォーム（結果は handleResult に渡される） */}
      <StockForm onResult={handleResult} />

      {/* 予測結果がある場合のみチャート表示 */}
      {stockData && (
        <div style={{ marginBottom: "2rem" }}>
          <StockChart data={stockData} />
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* 履歴一覧（クリック時は handleHistorySelect） */}
      <HistoryList onSelect={handleHistorySelect} />
    </div>
  );
}

export default App;
