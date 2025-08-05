import React, { useState, useRef, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  step?: number;
  label: string;
  unit?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  unit = ''
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const getValueFromPercentage = (percentage: number) => {
    return min + (percentage / 100) * (max - min);
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'min' | 'max') => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round(getValueFromPercentage(percentage) / step) * step;

    if (isDragging === 'min') {
      const newMin = Math.min(newValue, value.max - step);
      onChange({ min: newMin, max: value.max });
    } else {
      const newMax = Math.max(newValue, value.min + step);
      onChange({ min: value.min, max: newMax });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, value]);

  const minPercentage = getPercentage(value.min);
  const maxPercentage = getPercentage(value.max);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '0.5rem' 
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{label}</span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {value.min}{unit} - {value.max}{unit}
        </span>
      </div>
      
      <div
        ref={sliderRef}
        style={{
          position: 'relative',
          height: '20px',
          backgroundColor: '#e5e7eb',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        {/* 選択範囲の背景 */}
        <div
          style={{
            position: 'absolute',
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`,
            height: '100%',
            backgroundColor: '#8b5cf6',
            borderRadius: '10px'
          }}
        />
        
        {/* 最小値スライダー */}
        <div
          style={{
            position: 'absolute',
            left: `${minPercentage}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            backgroundColor: '#8b5cf6',
            borderRadius: '50%',
            cursor: 'grab',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
        />
        
        {/* 最大値スライダー */}
        <div
          style={{
            position: 'absolute',
            left: `${maxPercentage}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            backgroundColor: '#8b5cf6',
            borderRadius: '50%',
            cursor: 'grab',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
        />
      </div>
      
      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.25rem' }}>
        Range: {min}{unit} - {max}{unit}
      </div>
    </div>
  );
};

export default RangeSlider; 