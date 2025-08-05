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
      <div style={{
        backgroundColor: '#8b5cf6',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: '18px' }}>🔍</span>
        <span style={{ fontWeight: 'bold' }}>Filter Criteria</span>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* 名前検索フィルター */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#374151'
          }}>
            Company Name
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="会社名で検索..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* 国フィルター */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#374151'
          }}>
            Country
          </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            {availableCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* セクターフィルター */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#374151'
          }}>
            Sector
          </label>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option>All Sectors</option>
            {availableSectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* 財務比率セクション */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '1rem', 
            fontWeight: 'bold',
            color: '#374151'
          }}>
            Financial Ratios
          </label>

          {/* P/E Ratio */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>P/E Ratio</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="number"
                value={peRange.min}
                onChange={(e) => setPeRange({ ...peRange, min: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Min"
              />
              <input
                type="number"
                value={peRange.max}
                onChange={(e) => setPeRange({ ...peRange, max: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>P/B Ratio</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="number"
                value={pbRange.min}
                onChange={(e) => setPbRange({ ...pbRange, min: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Min"
              />
              <input
                type="number"
                value={pbRange.max}
                onChange={(e) => setPbRange({ ...pbRange, max: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>ROE (Return on Equity)</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="number"
                value={roeRange.min}
                onChange={(e) => setRoeRange({ ...roeRange, min: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Min"
              />
              <input
                type="number"
                value={roeRange.max}
                onChange={(e) => setRoeRange({ ...roeRange, max: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Dividend Yield</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="number"
                value={dividendRange.min}
                onChange={(e) => setDividendRange({ ...dividendRange, min: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Min"
              />
              <input
                type="number"
                value={dividendRange.max}
                onChange={(e) => setDividendRange({ ...dividendRange, max: Number(e.target.value) })}
                style={{
                  width: '50%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
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