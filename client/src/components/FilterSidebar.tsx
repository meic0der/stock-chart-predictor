import React from 'react';
import RangeSlider from './RangeSlider';

interface FilterSidebarProps {
  searchName: string;
  setSearchName: (value: string) => void;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedSector: string;
  setSelectedSector: (value: string) => void;
  peRange: { min: number; max: number };
  setPeRange: (value: { min: number; max: number }) => void;
  pbRange: { min: number; max: number };
  setPbRange: (value: { min: number; max: number }) => void;
  roeRange: { min: number; max: number };
  setRoeRange: (value: { min: number; max: number }) => void;
  dividendRange: { min: number; max: number };
  setDividendRange: (value: { min: number; max: number }) => void;
  availableSectors: string[];
  availableCountries: string[];
  isOpen: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
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
  availableCountries,
  isOpen
}) => {
  return (
    <div className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
      {/* フィルター条件ヘッダー */}
      <div className="filter-sidebar-header">
        <span style={{ fontSize: '18px' }}>🔍</span>
        <span style={{ fontWeight: 'bold' }}>Filter Criteria</span>
      </div>

      <div className="filter-sidebar-content">
        {/* 名前検索フィルター */}
        <div className="filter-group">
          <label className="filter-label">
            Company Name
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="会社名で検索..."
            className="filter-input"
          />
        </div>

        {/* 国フィルター */}
        <div className="filter-group">
          <label className="filter-label">
            Country
          </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="filter-input"
          >
            {availableCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* セクターフィルター */}
        <div className="filter-group">
          <label className="filter-label">
            Sector
          </label>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="filter-input"
          >
            <option>All Sectors</option>
            {availableSectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* 財務比率セクション */}
        <div className="filter-group">
          <label className="filter-label">
            Financial Ratios
          </label>

          {/* P/E Ratio */}
          <div style={{ marginBottom: '1rem' }}>
            <div className="range-label">P/E Ratio</div>
            <div className="range-inputs">
              <input
                type="number"
                value={peRange.min}
                onChange={(e) => setPeRange({ ...peRange, min: Number(e.target.value) })}
                className="range-input"
                placeholder="Min"
              />
              <input
                type="number"
                value={peRange.max}
                onChange={(e) => setPeRange({ ...peRange, max: Number(e.target.value) })}
                className="range-input"
                placeholder="Max"
              />
            </div>
            <RangeSlider
              min={-100}
              max={1000}
              value={peRange}
              onChange={setPeRange}
              step={1}
              label=""
            />
          </div>

          {/* P/B Ratio */}
          <div style={{ marginBottom: '1rem' }}>
            <div className="range-label">P/B Ratio</div>
            <div className="range-inputs">
              <input
                type="number"
                value={pbRange.min}
                onChange={(e) => setPbRange({ ...pbRange, min: Number(e.target.value) })}
                className="range-input"
                placeholder="Min"
              />
              <input
                type="number"
                value={pbRange.max}
                onChange={(e) => setPbRange({ ...pbRange, max: Number(e.target.value) })}
                className="range-input"
                placeholder="Max"
              />
            </div>
            <RangeSlider
              min={-100}
              max={300}
              value={pbRange}
              onChange={setPbRange}
              step={1}
              label=""
            />
          </div>

          {/* ROE */}
          <div style={{ marginBottom: '1rem' }}>
            <div className="range-label">ROE (Return on Equity)</div>
            <div className="range-inputs">
              <input
                type="number"
                value={roeRange.min}
                onChange={(e) => setRoeRange({ ...roeRange, min: Number(e.target.value) })}
                className="range-input"
                placeholder="Min"
              />
              <input
                type="number"
                value={roeRange.max}
                onChange={(e) => setRoeRange({ ...roeRange, max: Number(e.target.value) })}
                className="range-input"
                placeholder="Max"
              />
            </div>
            <RangeSlider
              min={-100}
              max={100}
              value={roeRange}
              onChange={setRoeRange}
              step={1}
              label=""
              unit="%"
            />
          </div>

          {/* Dividend Yield */}
          <div style={{ marginBottom: '1rem' }}>
            <div className="range-label">Dividend Yield</div>
            <div className="range-inputs">
              <input
                type="number"
                value={dividendRange.min}
                onChange={(e) => setDividendRange({ ...dividendRange, min: Number(e.target.value) })}
                className="range-input"
                placeholder="Min"
              />
              <input
                type="number"
                value={dividendRange.max}
                onChange={(e) => setDividendRange({ ...dividendRange, max: Number(e.target.value) })}
                className="range-input"
                placeholder="Max"
              />
            </div>
            <RangeSlider
              min={0}
              max={20}
              value={dividendRange}
              onChange={setDividendRange}
              step={0.1}
              label=""
              unit="%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 