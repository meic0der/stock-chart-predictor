import React from "react";
import FavoriteButton from "../components/FavoriteButton";

interface StockItem {
  symbol: string;
  name: string;
  country: string;
  sector: string;
  price: string;
  pe: number;
  pb: number;
  dividend: number; // 配当金を追加
  dividendYield: number;
  lastUpdated?: string;
  annualReturn?: number;
  volatility?: number;
}

interface StockTableProps {
  stocks: StockItem[];
  selectedStocks: Set<string>;
  onSelectAll: () => void;
  onSelectStock: (symbol: string) => void;
  onAddToPortfolio: (stock: StockItem) => void;
}

const StockTable: React.FC<StockTableProps> = ({
  stocks,
  selectedStocks,
  onSelectAll,
  onSelectStock,
  onAddToPortfolio
}) => {
  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr className="table-header">
            <th className="checkbox-header">
              <input
                type="checkbox"
                checked={selectedStocks.size === stocks.length}
                onChange={onSelectAll}
                className="select-all-checkbox"
              />
            </th>
            <th className="table-header-cell">Stock</th>
            <th className="table-header-cell">Country</th>
            <th className="table-header-cell">Sector</th>
            <th className="table-header-cell">Price</th>
            <th className="table-header-cell">P/E</th>
            <th className="table-header-cell">P/B</th>
            <th className="table-header-cell">Dividend</th>
            <th className="table-header-cell">Div Yield</th>
            <th className="table-header-cell">Annual Return</th>
            <th className="table-header-cell">Risk</th>
            <th className="table-header-cell">Updated</th>
            <th className="table-header-cell actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock: StockItem, index: number) => (
            <tr key={index} className="table-row">
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={selectedStocks.has(stock.symbol)}
                  onChange={() => onSelectStock(stock.symbol)}
                  className="stock-checkbox"
                />
              </td>
              <td className="stock-cell">
                <div>
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
              </td>
              <td className="country-cell">
                <span className="country-badge">{stock.country}</span>
              </td>
              <td className="sector-cell">{stock.sector}</td>
              <td className="price-cell">
                <span className="stock-price">{stock.price}</span>
              </td>
              <td className="pe-cell">{stock.pe || '-'}</td>
              <td className="pb-cell">{stock.pb || '-'}</td>
              <td className="dividend-cell">
                {stock.dividend !== null && stock.dividend !== undefined && typeof stock.dividend === 'number' ? 
                  `¥${stock.dividend.toFixed(2)}` : 
                  stock.dividend ? `¥${parseFloat(stock.dividend).toFixed(2)}` : '-'
                }
              </td>
              <td className="dividend-yield-cell">{stock.dividendYield ? `${stock.dividendYield}%` : '-'}</td>
              <td className="return-cell">
                {stock.annualReturn !== null && stock.annualReturn !== undefined && typeof stock.annualReturn === 'number' ? (
                  <span className={`return-value ${stock.annualReturn >= 0 ? 'positive' : 'negative'}`}>
                    {stock.annualReturn >= 0 ? '+' : ''}{stock.annualReturn.toFixed(2)}%
                  </span>
                ) : (
                  <span className="calculating">計算中...</span>
                )}
              </td>
              <td className="risk-cell">
                {stock.volatility !== null && stock.volatility !== undefined && typeof stock.volatility === 'number' ? (
                  <span className={`risk-value ${stock.volatility < 20 ? 'low' : stock.volatility < 40 ? 'medium' : 'high'}`}>
                    {stock.volatility.toFixed(2)}%
                  </span>
                ) : (
                  <span className="calculating">計算中...</span>
                )}
              </td>
              <td className="updated-cell">
                {stock.lastUpdated ? (
                  <span className="update-time" title={new Date(stock.lastUpdated).toLocaleString('ja-JP')}>
                    {new Date(stock.lastUpdated).toLocaleDateString('ja-JP', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                ) : (
                  <span className="not-updated">未更新</span>
                )}
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <FavoriteButton 
                    symbol={stock.symbol}
                    onFavoriteChange={(isFavorite) => {
                      console.log(`${stock.symbol} ${isFavorite ? 'added to' : 'removed from'} favorites`);
                    }}
                  />
                  <button
                    onClick={() => onAddToPortfolio(stock)}
                    className="portfolio-btn"
                    title="ポートフォリオに追加"
                  >
                    📊
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable; 