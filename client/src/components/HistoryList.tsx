import React, { useEffect, useState } from "react";
import { fetchHistory, updateNote, deleteHistory } from "../services/stockApi";
import type { HistoryItem } from "../types";

// type HistoryItem = {
//   id: number;
//   symbol: string;
//   predicted: number[];
//   predictedDates: string[];
//   actual: number[];
//   actualDates: string[];
//   company?: {
//     name?: string;
//     exchange?: string;
//     currency?: string;
//   };
//   note?: string;
//   created_at: string;
//   range: string;
//   model: string;
// };

type Props = {
  onSelect: (item: HistoryItem) => void;
  selectedItems: HistoryItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
};

const HistoryList: React.FC<Props> = ({
  onSelect,
  selectedItems,
  setSelectedItems,
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<{ [id: number]: string }>({});
  const [expandedSymbols, setExpandedSymbols] = useState<{
    [symbol: string]: boolean;
  }>({}); //銘柄ごとに展開、非展開

  //   expandedSymbols = {
  //   AAPL: true,  // AAPL は展開中
  //   TSLA: false, // TSLA は閉じている
  // }
  // const [selectedItems, setSelectedItems] = useState<number[]>([]);

  //チェックしてるIDを管理[2,3,8]

  // ✅ 履歴データを取得し、note用ドラフトも初期化
  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
      const drafts: { [id: number]: string } = {};
      data.forEach((item: HistoryItem) => {
        drafts[item.id] = item.note || "";
      });
      setNoteDrafts(drafts);
    } catch (err) {
      console.error("履歴の取得に失敗しました", err);
    }
  };

  // ✅ 初回のみ履歴取得
  useEffect(() => {
    loadHistory();
  }, []);

  // ✅ メモを保存する処理
  const handleSaveNote = async (id: number) => {
    try {
      const note = noteDrafts[id];
      await updateNote(id, note);
      await loadHistory(); // 再取得（リアルタイム反映）
    } catch (err) {
      console.error("メモ保存エラー:", err);
      alert("メモの保存に失敗しました");
    }
  };

  // ✅ 履歴を削除する処理
  const handleDelete = async (id: number) => {
    try {
      await deleteHistory(id);
      setHistory(history.filter((h) => h.id !== id));
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました");
    }
  };

  const groupedHistory = history.reduce<Record<string, HistoryItem[]>>(
    (acc, item) => {
      if (!acc[item.symbol]) {
        acc[item.symbol] = [];
      }
      acc[item.symbol].push(item);
      return acc;
    },
    {}
  );

  const toggleSymbol = (symbol: string) => {
    setExpandedSymbols((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  const toggleSelect = (item: HistoryItem) => {
    const exists = selectedItems.some((i) => i.id === item.id);
    setSelectedItems(
      exists
        ? selectedItems.filter((i) => i.id !== item.id)
        : [...selectedItems, item]
    );
  };

  return (
    <div>
      <h2>検索履歴</h2>

      {Object.entries(groupedHistory).map(([symbol, history]) => (
        <div key={symbol}>
          {/* トグルの親行 */}
          <div
            onClick={() => toggleSymbol(symbol)}
            style={{
              cursor: "pointer",
              background: "#f0f0f0",
              padding: "0.5rem",
              fontWeight: "bold",
            }}
          >
            📁 {symbol}
          </div>
          {/* トグルが開いていれば中のテーブルを表示 */}
          {expandedSymbols[symbol] && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem",
                textAlign: "left", // ← 追加：全体を左揃えにする
              }}
            >
              <thead>
                <tr>
                  <th>チェック</th>
                  <th>銘柄</th>
                  <th>検索日時</th>
                  <th>期間</th>
                  <th>モデル</th>
                  <th>メモ</th>
                  <th>削除</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor:
                        item.id === selectedId ? "#e0f0ff" : "transparent",
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.some((i) => i.id === item.id)}
                        onChange={() => toggleSelect(item)}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          onSelect(item);
                          setSelectedId(item.id);
                        }}
                        style={{
                          border: "none",
                          background: "none",
                          color: "blue",
                          cursor: "pointer",
                        }}
                      >
                        {item.symbol}
                      </button>
                    </td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>{item.range || "-"}</td>
                    <td>{item.model || "-"}</td>
                    <td>
                      <input
                        type="text"
                        value={noteDrafts[item.id] || ""}
                        onChange={(e) =>
                          setNoteDrafts({
                            ...noteDrafts,
                            [item.id]: e.target.value,
                          })
                        }
                      />
                      <button onClick={() => handleSaveNote(item.id)}>
                        保存
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(item.id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
