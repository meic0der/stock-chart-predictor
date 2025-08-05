import React from 'react';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* 左側：ハンバーガーメニューとタイトル */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            id="sidebar-toggle-header"
            onClick={onSidebarToggle}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              transition: 'background-color 0.2s',
              color: '#374151'
            }}
            title="サイドバーを開く"
          >
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>🔍</span>
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              Stock Screener
            </h1>
          </div>
        </div>

        {/* 右側：ナビゲーションリンク */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/" style={{
            textDecoration: 'none',
            color: '#374151',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.2s',
            backgroundColor: '#f3f4f6'
          }}>
            スクリーニング
          </a>
          <a href="/predict" style={{
            textDecoration: 'none',
            color: '#374151',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.2s'
          }}>
            株価予測
          </a>
          <a href="/favorites" style={{
            textDecoration: 'none',
            color: '#374151',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.2s'
          }}>
            お気に入り
          </a>
          <a href="/portfolio" style={{
            textDecoration: 'none',
            color: '#374151',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.2s'
          }}>
            マイポートフォリオ
          </a>
          <a href="/logout" style={{
            textDecoration: 'none',
            color: '#ef4444',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.2s'
          }}>
            ログアウト
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 