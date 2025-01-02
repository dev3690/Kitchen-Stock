import React, { useState } from 'react';
import '../styles/AddItemPopup.css';

function AddItemPopup({ isOpen, onClose, onSubmit, categoryId, categoryName, currentLanguage }) {
  const [itemNameEng, setItemNameEng] = useState('');
  const [itemNameGuj, setItemNameGuj] = useState('');
  const [unit, setUnit] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        categoryId: parseInt(categoryId),
        engName: itemNameEng,
        gujName: itemNameGuj,
        unit: unit,
        location: location,
        createdBy: 1  // You might want to get this from user context
      };
      
      await onSubmit(newItem);
      setItemNameEng('');
      setItemNameGuj('');
      setUnit('');
      setLocation('');
      onClose();
    } catch (error) {
      console.error('Error submitting item:', error);
      // Handle error (maybe show an error message to user)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>{currentLanguage === 'eng' ? 'Add New Item' : 'નવી વસ્તુ ઉમેરો'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">
              {currentLanguage === 'eng' ? 'Category' : 'શ્રેણી'}:
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              readOnly
              className="readonly-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemNameEng">
              {currentLanguage === 'eng' ? 'Item Name (English)' : 'વસ્તુનું નામ (અંગ્રેજી)'}:
            </label>
            <input
              type="text"
              id="itemNameEng"
              // placeholder='Item Name (English)'
              value={itemNameEng}
              onChange={(e) => setItemNameEng(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemNameGuj">
              {currentLanguage === 'eng' ? 'Item Name (Gujarati)' : 'વસ્તુનું નામ (ગુજરાતી)'}:
            </label>
            <input
              type="text"
              // placeholder='Item Name (Gujarati)'
              id="itemNameGuj"
              value={itemNameGuj}
              onChange={(e) => setItemNameGuj(e.target.value)}
              required
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="unit">
              {currentLanguage === 'eng' ? 'Unit' : 'એકમ'}:
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            >
              <option value="">
                {currentLanguage === 'eng' ? 'Select Unit' : 'એકમ પસંદ કરો'}
              </option>
              <option value="Kg">Kg</option>
              <option value="L">L</option>
            </select>
          </div>
           */}
            <div className="form-group">
            <label htmlFor="unit">
              {currentLanguage === 'eng' ? 'Unit' : 'એકમ'}:
            </label>
            <input
              type="text"
              // placeholder='Item Name (Gujarati)'
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Location">
              {currentLanguage === 'eng' ? 'Location' : 'સ્થળ'}:
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">
                {currentLanguage === 'eng' ? 'Select Unit' : 'એકમ પસંદ કરો'}
              </option>
              <option value="HPYM Kothar">HPYM Kothar</option>
              <option value="AVD">AVD</option>
              <option value="Sukun Cold Storage">Sukun Cold Storage</option>
              <option value="⁠Amar Cold Storage">⁠Amar Cold Storage</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">
              {currentLanguage === 'eng' ? 'Add' : 'ઉમેરો'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              {currentLanguage === 'eng' ? 'Cancel' : 'રદ કરો'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemPopup;
