import { useState } from "react";
import StockForm from "./components/StockForm";
import StockChart from "./components/StockChart";
import HistoryList from "./components/HistoryList";
import LogoutButton from "./components/LogOut";
import type { StockData, HistoryItem } from "./types";
import CompareChart from "./components/CompareChart";


function App() {
  // 株価予測＆実データを保持する状態（初期はnull）
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historyKey, setHistoryKey] = useState(0); // ← 強制再描画のためのキー

  const [selectedItems, setSelectedItems] = useState<HistoryItem[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // フォームで予測を取得した結果を受け取る
  const handleResult = (data: StockData) => {
    setStockData(data);
    setHistoryKey(prev => prev + 1); // ← 検索のたびにキーを更新
    setShowCompare(false); // 単体表示なので比較モード解除
  };

  // 履歴のアイテムがクリックされた時の処理
  const handleHistorySelect = (data: HistoryItem ) => {
    setStockData(data);
    setShowCompare(false); // 比較表示中は閉じる
  };

  const handleCompareToggle = () => {
    setShowCompare((prev) => !prev);
  };
  // const handleHistorySelect = (item: StockData) => {
  //   setStockData({
  //     actual: item.actual,
  //     actualDates: item.actualDates,
  //     predicted: item.predicted,
  //     predictedDates: item.predictedDates,
  //     company: item.company,
  //   });
  // };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📈 株価予測アプリ</h1>
      <LogoutButton />

      {/* 検索フォーム（結果は handleResult に渡される） */}
      <StockForm onResult={handleResult} />

      {/* 予測結果がある場合のみチャート表示 */}
      {stockData && (
        <div style={{ marginBottom: "2rem" }}>
          <StockChart data={stockData} />
        </div>
      )}

      <button onClick={handleCompareToggle} style={{ margin: "1rem 0" }}>
        {showCompare ? "比較チャートを閉じる" : "比較チャートを表示"}
      </button>

      {/* チャート表示 */}
      {showCompare ? (
        <CompareChart data={selectedItems} />
      ) : (
        stockData && <StockChart data={stockData} />
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* 履歴一覧（クリック時は handleHistorySelect） */}
      {/* useEffect(() => { loadHistory(); }, []); は key が変われば再マウントされて useEffect が呼ばれるため、履歴が再取得されます。 */}
      
      <HistoryList onSelect={handleHistorySelect} key={historyKey} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>

    </div>
  );
}

export default App;
