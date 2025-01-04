import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";
import { AuthContext } from '../context/AuthContext';
import AddItemPopup from '../components/AddItemPopup';
import { FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import { getCategoryData, insertItemData, searchApi, callAxiosApi } from '../api_utils';
import { AutoComplete } from 'primereact/autocomplete';

function DashboardPage({ changeLanguage, language }) {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('eng');
  const [isAddItemPopupOpen, setIsAddItemPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoryData = await getCategoryData();
        const formattedCategories = categoryData.map(category => ({
          id: category.categoryId,
          nameEng: category.engName,
          nameGuj: category.gujName,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }));
        setCategories(formattedCategories);
        setFilteredCategories(formattedCategories);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFilter = () => {
    const filtered = categories.filter(category => {
      const matchesSearch = 
        category.nameEng.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.nameGuj.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'category') return matchesSearch;
      return false;
    });
    setFilteredCategories(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchTerm, filterType]);

  const handleOpenAddItemPopup = (categoryId, categoryName) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setIsAddItemPopupOpen(true);
  };

  const handleCardClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };  
  const handlelogout = () => {
    navigate(`/login`);
  };

  const handleLanguageChange = () => {  
    setCurrentLanguage(prev => prev === 'eng' ? 'guj' : 'eng');
  };

  const getAllItems = () => {
    let items = [];
    categories.forEach(category => {
      if (category.items) {
        items = [...items, ...category.items.map(item => ({
          ...item,
          categoryName: currentLanguage === 'eng' ? category.nameEng : category.nameGuj
        }))];
      }
    });
    return items;
  };

  const searchItems = async (event) => {
    try {
      const response = await callAxiosApi(searchApi, {
        keyword: event.query
      });
      
      if (response.data.success) {
        setSuggestions(response.data.items || []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching items:', error);
      setSuggestions([]);
    }
  };

  const onItemSelect = (e) => {
    return;
  };

  const itemTemplate = (item) => {
    return (
      <div className="search-item">
        <div className="search-item-names">
          <span className="item-name-eng">{item.engName}</span>
          <span className="separator">|</span>
          <span className="item-name-guj">{item.gujName}</span>
        </div>
        <div className="search-item-details">
          <div className="search-item-category">
            <span className="category-eng">{item.categoryName}</span>
            <span className="separator">|</span>
            <span className="category-guj">{item.categoryGujName}</span>
          </div>
          <div className="search-item-quantity">
            {item.location && (
              <span className="location">({item.location})</span>
            )}
            {item.qty && (
              <span className="quantity">{item.qty} {item.unit}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Header 
        currentLanguage={currentLanguage} 
        handleLanguageChange={handleLanguageChange}
      />
      
      {isLoading ? (
        <div className="loading">Loading categories...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="search-container">
            <AutoComplete
              value={searchQuery}
              suggestions={suggestions}
              completeMethod={searchItems}
              field={currentLanguage === 'eng' ? 'engName' : 'gujName'}
              onChange={(e) => setSearchQuery(e.value)}
              placeholder={currentLanguage === 'eng' ? "Search items..." : "વસ્તુઓ શોધો..."}
              itemTemplate={itemTemplate}
              className="search-autocomplete"
              delay={300}
              showClear
            />
          </div>
          <div className="card-container">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="card"
                onClick={() => handleCardClick(category.id)}
              >
                <div className="card-header" style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}>
                  <button 
                    className="assign-button" 
                    onClick={(e) => {
                      e.stopPropagation();    
                      handleOpenAddItemPopup(category.id, currentLanguage === 'eng' ? category.nameEng : category.nameGuj);
                    }}
                  > 
                    <img src="/assets/new1.png" alt="Add Items" className="icon" style={{ width: "35px", height: "35px"}} />
                  </button>
                </div>
                <h2 className="card-title" style={{ color: '#333333', fontSize: '1.5rem', textAlign: 'center' }}>
                  {currentLanguage === 'eng' ? category.nameEng : category.nameGuj}
                </h2>
              </div>
            ))}
          </div>
        </>
      )}
      
      <AddItemPopup
        isOpen={isAddItemPopupOpen}
        onClose={() => setIsAddItemPopupOpen(false)}
        onSubmit={async (newItem) => {
          try {
            await insertItemData(newItem);
            setIsAddItemPopupOpen(false);
            // Optionally show a success message
          } catch (error) {
            console.error('Error adding new item:', error);
            // Handle error (show error message to user)
          }
        }}
        categoryId={selectedCategory?.id}
        categoryName={selectedCategory?.name}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}

export default DashboardPage;
