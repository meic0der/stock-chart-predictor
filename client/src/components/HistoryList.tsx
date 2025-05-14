import React, { useEffect, useState } from "react";
import { fetchHistory, updateNote, deleteHistory } from "../services/stockApi";

type HistoryItem = {
  id: number;
  symbol: string;
  predicted: number[];
  predictedDates: string[];
  actual: number[];
  actualDates: string[];
  company?: {
    name?: string;
    exchange?: string;
    currency?: string;
  };
  note?: string;
  created_at: string;
};

type Props = {
  onSelect: (item: HistoryItem) => void;
};

const HistoryList: React.FC<Props> = ({ onSelect }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<{ [id: number]: string }>({});

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

  return (
    <div>
      <h2>検索履歴</h2>
      <table>
        <thead>
          <tr>
            <th>銘柄</th>
            {/* <th>予測</th> */}
            <th>日時</th>
            <th>メモ</th>
            <th>操作</th>
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
                <button
                  onClick={() => {
                    onSelect(item); // グラフへ反映
                    setSelectedId(item.id); // 選択中ハイライト
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
              {/* <td>{item.predicted.join(", ")}</td> */}
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>
                <input
                  type="text"
                  value={noteDrafts[item.id] || ""}
                  onChange={(e) =>
                    setNoteDrafts({ ...noteDrafts, [item.id]: e.target.value })
                  }
                />
                <button onClick={() => handleSaveNote(item.id)}>保存</button>
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryList;
