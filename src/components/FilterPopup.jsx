import React, { useState } from 'react';
import '../styles/FilterPopup.css';

function FilterPopup({
  isOpen,
  onClose,
  filterCategory,
  setFilterCategory,
  filterName,
  setFilterName,
  filterDateRange,
  setFilterDateRange,   
  uniqueCategories,
  uniqueNames,
  handleFilter,
  filterGivenRange,
  setFilterGivenRange,
  filterUsedRange,
  setFilterUsedRange,
  selectedSevaTypes,
  setSelectedSevaTypes
}) {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  if (!isOpen) return null;

  const handleDateRangeChange = (range) => {
    if (range === 'custom') {
      setShowCustomRange(true);
      return;
    }
    
    setShowCustomRange(false);
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
        try {
            // Convert the HTML date input format (yyyy-mm-dd) to dd-mm-yyyy
            const formatToDisplayDate = (dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).replace(/\//g, '-');
            };

            setFilterDateRange({
                start: formatToDisplayDate(customStartDate),
                end: formatToDisplayDate(customEndDate)
            });
        } catch (error) {
            console.error('Error formatting custom dates:', error);
        }
    }
  };

  const handleSevaTypeChange = (sevaType) => {
    setSelectedSevaTypes(prev => ({
      ...prev,
      [sevaType]: !prev[sevaType]
    }));
  };

  return (
    <div className="filter-popup-overlay">
      <div className="filter-popup">
        <div className="filter-header">
          <h2>Filter Options</h2>
          <button className="clear-filters-button" onClick={() => {
            setFilterCategory('');
            setFilterName('');
            setFilterDateRange(null);
            setFilterGivenRange({ min: 0, max: 75000 });
            setFilterUsedRange({ min: 0, max: 75000 });
            setSelectedSevaTypes({
              purchase: false,
              seva: false,
              used: false,
              given: false
            });
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

        <div className="seva-types-container">
          <h3>Seva Types</h3>
          <div className="seva-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={selectedSevaTypes.purchase}
                onChange={() => handleSevaTypeChange('purchase')}
              />
              Purchase
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedSevaTypes.seva}
                onChange={() => handleSevaTypeChange('seva')}
              />
              Seva
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedSevaTypes.used}
                onChange={() => handleSevaTypeChange('used')}
              />
              Used
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedSevaTypes.given}
                onChange={() => handleSevaTypeChange('given')}
              />
              Given
            </label>
          </div>
        </div>

        <div className="date-filter-section">
          <select 
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="date-select"
          >
            <option value="custom">All Time</option>
            {/* <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">Last Year</option> */}
            <option value="custom">Custom Range</option>
          </select>

          {showCustomRange && (
            <div className="custom-date-inputs">
              <div className="date-input-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    handleCustomDateChange();
                  }}
                />
              </div>
              <div className="date-input-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    handleCustomDateChange();
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* <div className="range-selector">
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
        </div> */}

        {/* <div className="range-selector">
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
        </div> */}

        <div className="filter-popup-buttons">
          <button onClick={() => { handleFilter(); onClose(); }}>Apply Filter</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default FilterPopup;
