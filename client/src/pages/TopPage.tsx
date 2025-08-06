import React, { useState, useEffect } from "react";
import { 
  fetchMultipleStockData, 
  fetchFilteredStockData, 
  fetchAvailableFilters,
  updateSelectedStocks,
  updateAllStocks,
  fetchLastUpdated,
  resetAndReloadStocks
} from "../services/yahooFinanceApi";
import PageContainer from "../layout/PageContainer";
import StockTableHeader from "../layout/StockTableHeader";
import StockTable from "../layout/StockTable";
import LoadingState from "../layout/LoadingState";
import ErrorState from "../layout/ErrorState";
import EmptyState from "../layout/EmptyState";
import AddToPortfolioModal from "../components/AddToPortfolioModal";

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

const TopPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [searchName, setSearchName] = useState("");
  const [peRange, setPeRange] = useState({ min: -100, max: 1000 });
  const [pbRange, setPbRange] = useState({ min: -100, max: 300 });
  const [roeRange, setRoeRange] = useState({ min: -100, max: 100 });
  const [dividendRange, setDividendRange] = useState({ min: 0, max: 20 });
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [selectedStockForPortfolio, setSelectedStockForPortfolio] = useState<StockItem | null>(null);

  // サイドバートグル機能
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // App.tsxのグローバルヘッダーのサイドバートグルボタンとの連携
  useEffect(() => {
    const handleGlobalToggle = () => {
      setSidebarOpen(!sidebarOpen);
    };
    
    // カスタムイベントをリッスン
    window.addEventListener('toggleSidebar', handleGlobalToggle);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleGlobalToggle);
    };
  }, [sidebarOpen]);

  // 初期データの読み込み
  useEffect(() => {
    loadStockData();
  }, []);

  // フィルター条件が変更されたときにデータを再取得
  useEffect(() => {
    // 初期化後かつフィルター条件が変更された場合のみフィルタリングを実行
    if (isInitialized) {
      loadFilteredData();
    }
  }, [selectedCountry, selectedSector, searchName, peRange, pbRange, dividendRange]);

  const handleSelectAll = () => {
    if (selectedStocks.size === stocks.length) {
      setSelectedStocks(new Set());
    } else {
      setSelectedStocks(new Set(stocks.map(stock => stock.symbol)));
    }
  };

  const handleSelectStock = (symbol: string) => {
    const newSelected = new Set(selectedStocks);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    setSelectedStocks(newSelected);
  };

  const handleUpdateSelected = async () => {
    if (selectedStocks.size === 0) {
      alert('更新する銘柄を選択してください。');
      return;
    }

    try {
      setUpdating(true);
      const symbols = Array.from(selectedStocks);
      const updatedStocks = await updateSelectedStocks(symbols);
      
      if (updatedStocks.length > 0) {
        // 更新されたデータでstocksを更新
        const updatedStocksMap = new Map(updatedStocks.map((stock: StockItem) => [stock.symbol, stock]));
        const newStocks = stocks.map(stock => 
          updatedStocksMap.has(stock.symbol) ? updatedStocksMap.get(stock.symbol)! : stock
        );
        setStocks(newStocks);
        
        // 最終更新日時を更新
        const lastUpdatedTime = await fetchLastUpdated();
        setLastUpdated(lastUpdatedTime);
        
        alert(`${updatedStocks.length}銘柄を更新しました。`);
      }
    } catch (err) {
      setError('選択した銘柄の更新に失敗しました。');
      console.error('Error updating selected stocks:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAll = async () => {
    try {
      setUpdating(true);
      const updatedStocks = await updateAllStocks();
      
      if (updatedStocks.length > 0) {
        setStocks(updatedStocks);
        
        // 最終更新日時を更新
        const lastUpdatedTime = await fetchLastUpdated();
        setLastUpdated(lastUpdatedTime);
        
        alert(`${updatedStocks.length}銘柄を更新しました。`);
      }
    } catch (err) {
      setError('全銘柄の更新に失敗しました。');
      console.error('Error updating all stocks:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleResetAndReload = async () => {
    if (!confirm('データベースをリセットして正しいセクター情報で再取得しますか？この操作には時間がかかります。')) {
      return;
    }

    try {
      setUpdating(true);
      const updatedStocks = await resetAndReloadStocks();
      
      if (updatedStocks.length > 0) {
        setStocks(updatedStocks);
        
        // 最終更新日時を更新
        const lastUpdatedTime = await fetchLastUpdated();
        setLastUpdated(lastUpdatedTime);
        
        // フィルターオプションも更新
        const filters = await fetchAvailableFilters();
        setAvailableSectors(filters.sectors);
        setAvailableCountries(filters.countries);
        
        alert(`データベースをリセットして${updatedStocks.length}銘柄を正しいセクター情報で再取得しました。`);
      }
    } catch (err) {
      setError('データベースのリセットと再取得に失敗しました。');
      console.error('Error resetting and reloading stocks:', err);
    } finally {
      setUpdating(false);
    }
  };

  const loadStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 並行してデータとフィルターオプションを取得
      const [data, filters] = await Promise.all([
        fetchMultipleStockData(),
        fetchAvailableFilters()
      ]);
      
      setStocks(data);
      setAvailableSectors(filters.sectors);
      setAvailableCountries(filters.countries);
      setIsInitialized(true);
    } catch (err) {
      setError('データの読み込みに失敗しました。');
      console.error('Error loading stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      setLoading(true);
      
      // "All Countries"や"All Sectors"の場合はundefinedを送信
      const countryFilter = selectedCountry === 'All Countries' ? undefined : selectedCountry;
      const sectorFilter = selectedSector === 'All Sectors' ? undefined : selectedSector;
      const nameFilter = searchName.trim() === '' ? undefined : searchName.trim();
      
      const filteredData = await fetchFilteredStockData(
        countryFilter,
        sectorFilter,
        nameFilter,
        peRange,
        pbRange,
        dividendRange
      );
      setStocks(filteredData);
    } catch (err) {
      setError('フィルター適用中にエラーが発生しました。');
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStockData();
  };

  const handleAddToPortfolio = (stock: StockItem) => {
    setSelectedStockForPortfolio(stock);
    setPortfolioModalOpen(true);
  };

  const handlePortfolioSuccess = () => {
    // ポートフォリオ追加成功時の処理
    console.log('Portfolio updated successfully');
  };

  const filterProps = {
    searchName,
    setSearchName,
    selectedCountry,
    setSelectedCountry,
    selectedSector,
    setSelectedSector,
    peRange,
    setPeRange,
    pbRange,
    setPbRange,
    roeRange,
    setRoeRange,
    dividendRange,
    setDividendRange,
    availableSectors,
    availableCountries
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={handleRefresh} />;
    }

    if (stocks.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="stock-table-container">
        <StockTableHeader
          stocksCount={stocks.length}
          lastUpdated={lastUpdated}
          loading={loading}
          updating={updating}
          selectedStocksCount={selectedStocks.size}
          onRefresh={handleRefresh}
          onUpdateSelected={handleUpdateSelected}
          onUpdateAll={handleUpdateAll}
          onResetAndReload={handleResetAndReload}
        />
        <StockTable
          stocks={stocks}
          selectedStocks={selectedStocks}
          onSelectAll={handleSelectAll}
          onSelectStock={handleSelectStock}
          onAddToPortfolio={handleAddToPortfolio}
        />
      </div>
    );
  };

  return (
    <PageContainer
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      filterProps={filterProps}
    >
      {renderContent()}

      {/* ポートフォリオ追加モーダル */}
      {selectedStockForPortfolio && (
        <AddToPortfolioModal
          isOpen={portfolioModalOpen}
          onClose={() => {
            setPortfolioModalOpen(false);
            setSelectedStockForPortfolio(null);
          }}
          stock={selectedStockForPortfolio}
          onSuccess={handlePortfolioSuccess}
        />
      )}
    </PageContainer>
  );
};

export default TopPage; 