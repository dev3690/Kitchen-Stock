import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/CategoryDetailPage.css";
import { AuthContext } from "../context/AuthContext";
import AddItemPopup from "../components/AddItemPopup";
import PlusFormPopup from "../components/PlusFormPopup";
import MinusFormPopup from "../components/MinusFormPopup";
import Header from '../components/Header';
import { getItemData, getCategoryData, manageItem, getTransactionHistory } from '../api_utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function CategoryDetailPage() {
  const { id } = useParams();
  const [currentLanguage, setCurrentLanguage] = useState("eng");
  const [isAddItemPopupOpen, setIsAddItemPopupOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryName, setCategoryName] = useState({ nameEng: "", nameGuj: "" });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlusFormPopupOpen, setIsPlusFormPopupOpen] = useState(false);
  const [selectedGrainCard, setSelectedGrainCard] = useState(null);
  const [isMinusFormPopupOpen, setIsMinusFormPopupOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [transactionData, setTransactionData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state
        
        // Fetch category details
        const categoryData = await getCategoryData();
        const currentCategory = categoryData.find(cat => cat.categoryId === parseInt(id));
        
        if (!currentCategory) {
          throw new Error('Category not found');
        }
        
        setCategoryName({
          nameEng: currentCategory.engName,
          nameGuj: currentCategory.gujName
        });

        // Fetch items for this category
        const items = await getItemData(parseInt(id));
        const formattedItems = Array.isArray(items) ? items.map(item => ({
          id: item.itemId,
          nameEng: item.engName,
          nameGuj: item.gujName,
          quantity: item.qty || 0,
          unit: item.unit || 'kg',
          categoryId: item.categoryId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })) : [];
        
        setCategoryItems(formattedItems);
      } catch (err) {
        setError(err.message || 'Failed to load items');
        console.error('Error loading items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (id, change) => {
    if (change > 0) {
      const selectedItem = categoryItems.find((item) => item.id === id);
      setSelectedGrainCard(selectedItem);
      setIsPlusFormPopupOpen(true);
    } else {
      const selectedItem = categoryItems.find((item) => item.id === id);
      setSelectedGrainCard(selectedItem);
      setIsMinusFormPopupOpen(true);
    }
  };

  const handleLanguageChange = () => {
    setCurrentLanguage((prev) => (prev === "eng" ? "guj" : "eng"));
  };

  const handleAddItem = (newItem) => {
    setCategoryItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        nameEng: newItem.itemName,
        nameGuj: newItem.itemName,
        quantity: newItem.quantity,
        unit: newItem.unit,
      },
    ]);
  };

  const handlePlusFormSubmit = async (formData) => {
    try {
      const response = await manageItem(formData);
      if (!response.errorStatus) {
        // Update the item quantity in the local state
        setCategoryItems(prevItems => 
          prevItems.map(item => 
            item.id === formData.itemId 
              ? { ...item, quantity: response.data.item.qty }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error managing item:', error);
      // Handle error (show error message to user)
    }
  };

  const handleMinusFormSubmit = async (formData) => {
    try {
      const response = await manageItem(formData);
      if (!response.errorStatus) {
        // Update the item quantity in the local state
        setCategoryItems(prevItems => 
          prevItems.map(item => 
            item.id === formData.itemId 
              ? { ...item, quantity: response.data.item.qty }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error managing item:', error);
      // Handle error (show error message to user)
    } finally {
      setIsMinusFormPopupOpen(false);
    }
  };

  const toggleCard = async (id) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        getTransactionHistory(id).then(data => {
          setTransactionData(prev => ({
            ...prev,
            [id]: data
          }));
        });
      }
      return newSet;
    });
  };

  return (
    <div className="category-detail-container">
      <Header
        currentLanguage={currentLanguage}
        handleLanguageChange={handleLanguageChange}
      />
      <div className="category-detail-header">
        <h1 style={{
          backgroundColor: "#ffffff",
          borderRadius: "50px",
          color: "#2B3674"
        }}>
          {currentLanguage === "eng" ? categoryName.nameEng : categoryName.nameGuj}
        </h1>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading items...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="card-container">
          {categoryItems.map((item) => (
            <div key={item.id} className="card" style={{ backgroundColor: "#FFFFFF66" }}>
              <div className="card-content">
                <div className="card-header">
                  <button
                    className="quantity-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item.id, 1);
                    }}
                  >
                    <img src="/assets/new1.png" alt="Increase" className="icon" />
                  </button>
                  <button
                    className="quantity-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item.id, -1);
                    }}
                  >
                    <img src="/assets/minus1.png" alt="Decrease" className="icon" />
                  </button>
                </div>
                <h2 className="card-title">
                  {currentLanguage === "eng" ? item.nameEng : item.nameGuj}
                </h2>
                <p className="card-quantity">{item.quantity} {item.unit}</p>
                <button 
                  className="expand-button"
                  onClick={() => toggleCard(item.id)}
                >
                  {expandedCards.has(item.id) ? '▼' : '▶'}
                </button>
              </div>

              {expandedCards.has(item.id) && (
                <div className="expanded-content">
                  <DataTable 
                    value={transactionData[item.id] || []}
                    scrollable 
                    scrollHeight="200px"
                    scrollDirection="both"
                    stripedRows
                    size="small"
                    showGridlines
                    loading={!transactionData[item.id]}
                    rowClassName={(rowData) => ({
                      'green-row': rowData.itemTo === 'Add',
                      'red-row': rowData.itemTo === 'Remove'
                    })}
                  >
                    <Column field="manageId" header="Sr." style={{ minWidth: '70px' }} />
                    <Column field="itemName" header="Name" style={{ minWidth: '100px' }} />
                    <Column field="unit" header="Unit" style={{ minWidth: '70px' }} />
                    <Column field="type" header="Type" style={{ minWidth: '80px' }} />
                    <Column field="qty" header="Qty" style={{ minWidth: '70px' }} />
                    <Column field="date" header="Date" style={{ minWidth: '130px' }} />
                    <Column field="sevakName" header="Sevak Name" style={{ minWidth: '120px' }} />
                    <Column field="sevakNo" header="Sevak Number" style={{ minWidth: '120px' }} />
                  </DataTable>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddItemPopup
        isOpen={isAddItemPopupOpen}
        onClose={() => setIsAddItemPopupOpen(false)}
        onSubmit={handleAddItem}
        categoryId={id}
        categoryName={currentLanguage === "eng" ? categoryName.nameEng : categoryName.nameGuj}
        currentLanguage={currentLanguage}
      />
      <PlusFormPopup
        isOpen={isPlusFormPopupOpen}
        onClose={() => setIsPlusFormPopupOpen(false)}
        onSubmit={handlePlusFormSubmit}
        itemId={selectedGrainCard?.id}
        itemName={
          selectedGrainCard
            ? currentLanguage === "eng"
              ? selectedGrainCard.nameEng
              : selectedGrainCard.nameGuj
            : ""
        }
        defaultUnit="kg"
        currentLanguage={currentLanguage}
      />
      <MinusFormPopup
        isOpen={isMinusFormPopupOpen}
        onClose={() => setIsMinusFormPopupOpen(false)}
        onSubmit={handleMinusFormSubmit}
        itemId={selectedGrainCard?.id}
        itemName={
          selectedGrainCard
            ? currentLanguage === "eng"
              ? selectedGrainCard.nameEng
              : selectedGrainCard.nameGuj
            : ""
        }
        defaultUnit="kg"
        currentLanguage={currentLanguage}
      />
    </div>
  );
}

export default CategoryDetailPage;
