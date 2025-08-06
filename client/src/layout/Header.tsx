import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../components/LogOut";

const Header: React.FC = () => {
  const location = useLocation();
  const isTopPage = location.pathname === '/';

  const handleSidebarToggle = () => {
    const event = new CustomEvent('toggleSidebar');
    window.dispatchEvent(event);
  };

  return (
    <header className="app-header">
      <nav className="header-nav">
        <div className="header-left">
          {isTopPage && (
            <button
              id="sidebar-toggle-header"
              className="sidebar-toggle-btn"
              title="サイドバーを開く"
              onClick={handleSidebarToggle}
            >
              ☰
            </button>
          )}
          <div className="app-logo">
            <span>🔍</span>
          </div>
          <h1 className="app-title">Stock Screener</h1>
        </div>
        <div className="header-right">
          <Link className="nav-link" to="/">スクリーニング</Link>
          <Link className="nav-link" to="/predict">株価予測</Link>
          <Link className="nav-link" to="/favorites">お気に入り</Link>
          <Link className="nav-link" to="/portfolio">マイポートフォリオ</Link>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
};

export default Header; 