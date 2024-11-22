import React, { useState } from 'react';
import '../styles/FilterPopup.css';

function FilterPopup({
  isOpen,
  onClose,
  filterCategory,
  setFilterCategory,
  filterName,
  setFilterName,
  filterSeva,
  setFilterSeva,
  filterDateRange,
  setFilterDateRange,
  uniqueCategories,
  uniqueNames,
  uniqueSevas,
  handleFilter,
  filterGivenRange,
  setFilterGivenRange,
  filterUsedRange,
  setFilterUsedRange
}) {
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  if (!isOpen) return null;

  const handleDateRangeChange = (range) => {
    const end = new Date();
    let start = new Date();
    
    switch (range) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case '6months':
        start.setMonth(end.getMonth() - 6);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case 'custom':
        return; // Don't set the date range yet, wait for custom input
      default:
        start = null;
        end = null;
    }
    
    if (start && end) {
      setFilterDateRange({ 
        start: start.toISOString().split('T')[0], 
        end: end.toISOString().split('T')[0] 
      });
    } else {
      setFilterDateRange(null);
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      setFilterDateRange({ start: customStartDate, end: customEndDate });
    }
  };

  const handleGivenRangeChange = (min, max) => {
    setFilterGivenRange({ min, max });
  };

  const handleUsedRangeChange = (min, max) => {
    setFilterUsedRange({ min, max });
  };

  return (
    <div className="filter-popup-overlay">
      <div className="filter-popup">
        <div className="filter-header">
          <h2>Filter Options</h2>
          <button className="clear-filters-button" onClick={() => {
            setFilterCategory('');
            setFilterName('');
            setFilterSeva('');
            setFilterDateRange(null);
            setFilterGivenRange({ min: 0, max: 75000 });
            setFilterUsedRange({ min: 0, max: 75000 });
          }}>
            Clear All Filters
          </button>
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select value={filterName} onChange={(e) => setFilterName(e.target.value)}>
          <option value="">All Names</option>
          {uniqueNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <select value={filterSeva} onChange={(e) => setFilterSeva(e.target.value)}>
          <option value="">All Sevas</option>
          {uniqueSevas.map(seva => (
            <option key={seva} value={seva}>{seva}</option>
          ))}
        </select>
        <select onChange={(e) => handleDateRangeChange(e.target.value)}>
          <option value="">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
        {filterDateRange && filterDateRange.start && filterDateRange.end && (
          <div className="custom-date-range">
            <input
              type="date"
              value={filterDateRange.start}
              onChange={(e) => setFilterDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <input
              type="date"
              value={filterDateRange.end}
              onChange={(e) => setFilterDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        )}

        <div className="range-selector">
          <label>Given Range:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={filterGivenRange.min}
            onChange={(e) => handleGivenRangeChange(parseInt(e.target.value), filterGivenRange.max)}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={filterGivenRange.max}
            onChange={(e) => handleGivenRangeChange(filterGivenRange.min, parseInt(e.target.value))}
          />
          <div className="range-values">
            <span>₹{filterGivenRange.min}</span>
            <span>{filterGivenRange.max}</span>
          </div>
        </div>

        <div className="range-selector">
          <label>Used Range:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={filterUsedRange.min}
            onChange={(e) => handleUsedRangeChange(parseInt(e.target.value), filterUsedRange.max)}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={filterUsedRange.max}
            onChange={(e) => handleUsedRangeChange(filterUsedRange.min, parseInt(e.target.value))}
          />
          <div className="range-values">
            <span>₹{filterUsedRange.min}</span>
            <span>₹{filterUsedRange.max}</span>
          </div>
        </div>

        <div className="filter-popup-buttons">
          <button onClick={() => { handleFilter(); onClose(); }}>Apply Filter</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default FilterPopup;
