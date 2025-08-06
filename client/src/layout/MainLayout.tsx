import { ReactNode } from "react";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 