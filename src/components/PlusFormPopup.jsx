import React, { useState } from 'react';
import '../styles/AddItemPopup.css';

function PlusFormPopup({ isOpen, onClose, onSubmit, itemId, itemName, defaultUnit, currentLanguage }) {
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('purchase');
  const [sevakName, setSevakName] = useState('');
  const [sevakNo, setSevakNo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        qty: parseInt(quantity),
        itemId: itemId,
        type: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
        sevakName: type === 'seva' ? sevakName : '',
        sevakNo: type === 'seva' ? sevakNo : '',
        itemTo: "Add",
        createdBy: 1
      };

      await onSubmit(formData);
      // Reset form
      setQuantity('');
      setType('purchase');
      setSevakName('');
      setSevakNo('');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>{currentLanguage === 'eng' ? 'Add Item' : 'વસ્તુ ઉમેરો'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="itemName">
              {currentLanguage === 'eng' ? 'Item Name' : 'વતુનું નામ'}:
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              readOnly
              className="readonly-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">
              {currentLanguage === 'eng' ? 'Quantity' : 'જથ્થો'}:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">
              {currentLanguage === 'eng' ? 'Type' : 'પ્રકાર'}:
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="purchase">{currentLanguage === 'eng' ? 'Purchase' : 'ખરીદી'}</option>
              <option value="seva">{currentLanguage === 'eng' ? 'Seva' : 'સેવા'}</option>
            </select>
          </div>
          {type === 'seva' && (
            <>
              <div className="form-group">
                <label htmlFor="sevakName">
                  {currentLanguage === 'eng' ? 'Sevak Name' : 'સેવકનું નામ'}:
                </label>
                <input
                  type="text"
                  id="sevakName"
                  value={sevakName}
                  onChange={(e) => setSevakName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="sevakNo">
                  {currentLanguage === 'eng' ? 'Sevak No' : 'સેવક નંબર'}:
                </label>
                <input
                  type="text"
                  id="sevakNo"
                  value={sevakNo}
                  onChange={(e) => setSevakNo(e.target.value)}
                  required
                />
              </div>
            </>
          )}
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

export default PlusFormPopup;

