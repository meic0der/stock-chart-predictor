import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import TopPage from "./pages/TopPage";
import PredictPage from "./pages/PredictPage";
import PortfolioPage from "./pages/PortfolioPage";
import FavoritesPage from "./pages/FavoritesPage";
import StockDetailPage from "./pages/StockDetailPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./layout/layout.css";

function App() {
  return (
    <Routes>
      {/* 認証関連のルート */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      
      {/* メインアプリケーションのルート */}
      <Route path="/*" element={
        <MainLayout>
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;
