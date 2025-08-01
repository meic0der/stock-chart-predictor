import React, { useEffect, useState } from "react";
import { fetchHistory, updateNote, deleteHistory } from "../services/stockApi";
import type { HistoryItem } from "../types";

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
  }>({});

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
    <div style={{ 
      background: '#fff', 
      borderRadius: '1.2rem', 
      boxShadow: '0 4px 24px 0 rgba(60, 72, 88, 0.10)',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      {/* ヘッダー部分 */}
      <div style={{ 
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
          検索履歴
        </h2>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1rem',
          margin: '0'
        }}>
          過去の予測分析履歴を管理・比較
        </p>
      </div>

      {/* 統計情報 */}
      <div style={{ 
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '0.8rem',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>
              {history.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>総履歴数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>
              {Object.keys(groupedHistory).length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>銘柄数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>
              {selectedItems.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>選択中</div>
          </div>
        </div>
      </div>

      {Object.entries(groupedHistory).map(([symbol, history]) => (
        <div key={symbol} style={{ 
          marginBottom: '1.5rem', 
          borderRadius: '1rem', 
          overflow: 'hidden', 
          boxShadow: '0 2px 8px 0 rgba(60,72,88,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          {/* トグルの親行 */}
          <div
            onClick={() => toggleSymbol(symbol)}
            style={{
              cursor: "pointer",
              background: "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%)",
              padding: "1rem 1.5rem",
              fontWeight: "600",
              fontSize: '1.1rem',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📁</span>
              <span>{symbol}</span>
              <span style={{ 
                background: '#6366f1', 
                color: '#fff', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '1rem',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                {history.length}件
              </span>
            </div>
            <span style={{ 
              fontSize: '1.2rem',
              transition: 'transform 0.2s',
              transform: expandedSymbols[symbol] ? 'rotate(90deg)' : 'rotate(0deg)'
            }}>
              ▶
            </span>
          </div>
          
          {/* トグルが開いていれば中のテーブルを表示 */}
          {expandedSymbols[symbol] && (
            <div style={{ background: '#fff' }}>
              <div style={{ 
                overflowX: 'auto',
                borderTop: '1px solid #e2e8f0'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem'
                }}>
                  <thead>
                    <tr style={{ 
                      background: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#374151',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        選択
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#374151',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        銘柄
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#374151',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        検索日時
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#374151',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        期間
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#374151',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        モデル
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#374151',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        メモ
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor: item.id === selectedId ? "#f0f9ff" : "transparent",
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.2s'
                        }}
                      >
                        <td style={{ 
                          padding: '1rem', 
                          borderRight: '1px solid #e2e8f0',
                          textAlign: 'center'
                        }}>
                          <input
                            type="checkbox"
                            checked={selectedItems.some((i) => i.id === item.id)}
                            onChange={() => toggleSelect(item)}
                            style={{ 
                              width: 18, 
                              height: 18,
                              accentColor: '#6366f1'
                            }}
                          />
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          borderRight: '1px solid #e2e8f0'
                        }}>
                          <button
                            onClick={() => {
                              onSelect(item);
                              setSelectedId(item.id);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#6366f1',
                              fontWeight: '600',
                              cursor: 'pointer',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.5rem',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#e0e7ff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'none';
                            }}
                          >
                            {item.symbol}
                          </button>
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          borderRight: '1px solid #e2e8f0',
                          color: '#64748b'
                        }}>
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          borderRight: '1px solid #e2e8f0',
                          color: '#64748b'
                        }}>
                          {item.range || "-"}
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          borderRight: '1px solid #e2e8f0',
                          color: '#64748b'
                        }}>
                          {item.model || "-"}
                        </td>
                        <td style={{ 
                          padding: '1rem', 
                          borderRight: '1px solid #e2e8f0',
                          minWidth: 200
                        }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={noteDrafts[item.id] || ""}
                              onChange={(e) =>
                                setNoteDrafts({
                                  ...noteDrafts,
                                  [item.id]: e.target.value,
                                })
                              }
                              placeholder="メモを入力..."
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.9rem'
                              }}
                            />
                            <button 
                              onClick={() => handleSaveNote(item.id)}
                              style={{
                                background: '#10b981',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#059669';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#10b981';
                              }}
                            >
                              保存
                            </button>
                          </div>
                        </td>
                        <td style={{ 
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            title="削除"
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              padding: '0.5rem',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dc2626';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#ef4444';
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}

      {Object.keys(groupedHistory).length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            履歴がありません
          </div>
          <div style={{ fontSize: '1rem' }}>
            株価予測を実行すると、ここに履歴が表示されます
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
