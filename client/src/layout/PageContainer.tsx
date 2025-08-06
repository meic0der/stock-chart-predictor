import type { ReactNode } from "react";
import FilterSidebar from "../components/FilterSidebar";

interface PageContainerProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  filterProps: {
    searchName: string;
    setSearchName: (name: string) => void;
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
    selectedSector: string;
    setSelectedSector: (sector: string) => void;
    peRange: { min: number; max: number };
    setPeRange: (range: { min: number; max: number }) => void;
    pbRange: { min: number; max: number };
    setPbRange: (range: { min: number; max: number }) => void;
    roeRange: { min: number; max: number };
    setRoeRange: (range: { min: number; max: number }) => void;
    dividendRange: { min: number; max: number };
    setDividendRange: (range: { min: number; max: number }) => void;
    availableSectors: string[];
    availableCountries: string[];
  };
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  sidebarOpen, 
  setSidebarOpen,
  filterProps 
}) => {
  return (
    <div className={`page-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* オーバーレイ */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="sidebar-overlay"
        />
      )}

      {/* 左サイドバー - フィルター条件 */}
      <FilterSidebar
        searchName={filterProps.searchName}
        setSearchName={filterProps.setSearchName}
        selectedCountry={filterProps.selectedCountry}
        setSelectedCountry={filterProps.setSelectedCountry}
        selectedSector={filterProps.selectedSector}
        setSelectedSector={filterProps.setSelectedSector}
        peRange={filterProps.peRange}
        setPeRange={filterProps.setPeRange}
        pbRange={filterProps.pbRange}
        setPbRange={filterProps.setPbRange}
        roeRange={filterProps.roeRange}
        setRoeRange={filterProps.setRoeRange}
        dividendRange={filterProps.dividendRange}
        setDividendRange={filterProps.setDividendRange}
        availableSectors={filterProps.availableSectors}
        availableCountries={filterProps.availableCountries}
        isOpen={sidebarOpen}
      />

      {/* 右メインエリア */}
      <div className="main-content-area">
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 