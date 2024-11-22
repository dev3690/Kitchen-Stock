import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";
import { AuthContext } from '../context/AuthContext';
import AddItemPopup from '../components/AddItemPopup';
import { FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import { getCategoryData, insertItemData } from '../api_utils';

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
            <div className="search-bar">
              <input
                type="text"
                placeholder={currentLanguage === 'eng' ? "Search..." : "શોધો..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
          </div>
          <div className="card-container">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="card"
                onClick={() => handleCardClick(category.id)}
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="card-header">
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
