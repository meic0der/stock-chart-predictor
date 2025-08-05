import { Routes, Route, Link, useLocation } from "react-router-dom";
import TopPage from "./pages/TopPage";
import PredictPage from "./pages/PredictPage";
import PortfolioPage from "./pages/PortfolioPage";
import FavoritesPage from "./pages/FavoritesPage";
import StockDetailPage from "./pages/StockDetailPage";
import LogoutButton from "./components/LogOut";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  const location = useLocation();
  const isTopPage = location.pathname === '/';

  return (
    <div className="app-container">
      <Routes>
        {/* 認証関連のルート */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {/* メインアプリケーションのルート */}
        <Route path="/*" element={
          <>
            {/* ヘッダーナビゲーション */}
            <header style={{ 
              backgroundColor: '#fff', 
              borderBottom: '1px solid #e0e0e0', 
              padding: '1rem',
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <nav style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                maxWidth: '1400px',
                margin: '0 auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isTopPage && (
                    <button
                      id="sidebar-toggle-header"
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        minWidth: '36px',
                        minHeight: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.5rem'
                      }}
                      title="サイドバーを開く"
                      onClick={() => {
                        // TopPageのサイドバートグル機能をトリガー
                        const event = new CustomEvent('toggleSidebar');
                        window.dispatchEvent(event);
                      }}
                    >
                      ☰
                    </button>
                  )}
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#3b82f6', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px' }}>🔍</span>
                  </div>
                  <h1 style={{ 
                    margin: 0, 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>
                    Stock Screener
                  </h1>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <Link className="form-link" to="/">スクリーニング</Link>
                  <Link className="form-link" to="/predict">株価予測</Link>
                  <Link className="form-link" to="/favorites">お気に入り</Link>
                  <Link className="form-link" to="/portfolio">マイポートフォリオ</Link>
                  <LogoutButton />
                </div>
              </nav>
            </header>
            
            <Routes>
              <Route path="/" element={<TopPage />} />
              <Route path="/predict" element={<PredictPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/stock/:symbol" element={<StockDetailPage />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
