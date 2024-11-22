import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReportsPage.css';
import { FaFilter, FaArrowLeft } from 'react-icons/fa';
import FilterPopup from '../components/FilterPopup';
import Header from '../components/Header';


const reportData = [
    { slNo: '01.', name: 'Wheat', unit: 'KG', quantity: 8, category: 'Grains', date: '2024-01-01', seva: '40', given: 10, used: 8 },
    { slNo: '02.', name: 'Corn', unit: 'KG', quantity: 36, category: 'Grains', date: '2024-02-02', seva: '10', given: 40, used: 36 },
    { slNo: '03.', name: 'Rice', unit: 'KG', quantity: 12, category: 'Grains', date: '2024-03-03', seva: '11', given: 15, used: 12 },
    { slNo: '04.', name: 'Millet', unit: 'Liter', quantity: 25, category: 'Vegetables', date: '2024-04-04', seva: '9', given: 30, used: 25 },
    { slNo: '05.', name: 'Buttermilk', unit: 'Liter', quantity: 5, category: 'Miscellaneous', date: '2024-05-05', seva: '20', given: 8, used: 5 },
    { slNo: '06.', name: 'Barley', unit: 'KG', quantity: 14, category: 'Vegetables', date: '2024-06-06', seva: '30', given: 20, used: 14 },
    { slNo: '07.', name: 'Oats', unit: 'KG', quantity: 9, category: 'Miscellaneous', date: '2024-07-07', seva: '14', given: 12, used: 9 },
    { slNo: '08.', name: 'Pratik', unit: 'KG', quantity: 3, category: 'Miscellaneous', date: '2024-08-08', seva: '15', given: 5, used: 3 },
    { slNo: '09.', name: 'Barley', unit: 'KG', quantity: 14, category: 'Vegetables', date: '2024-09-09', seva: '5', given: 18, used: 14 },
    { slNo: '10.', name: 'Oats', unit: 'KG', quantity: 9, category: 'Miscellaneous', date: '2024-10-10', seva: '18', given: 15, used: 9 },
];

function ReportsPage({ currentLanguage, handleLanguageChange }) {
    const navigate = useNavigate();
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterSeva, setFilterSeva] = useState('');
    const [filterDateRange, setFilterDateRange] = useState(null);
    const [filteredData, setFilteredData] = useState(reportData);
    const [filterGivenRange, setFilterGivenRange] = useState({ min: 0, max: 75000 });
    const [filterUsedRange, setFilterUsedRange] = useState({ min: 0, max: 75000 });

    const uniqueCategories = [...new Set(reportData.map(item => item.category))];
    const uniqueNames = [...new Set(reportData.map(item => item.name))];
    const uniqueSevas = [...new Set(reportData.map(item => item.seva))];

    const handleFilter = () => {
        const filtered = reportData.filter(item => {
            const itemDate = new Date(item.date);
            return (
                (filterCategory === '' || item.category === filterCategory) &&
                (filterName === '' || item.name === filterName) &&
                (filterSeva === '' || item.seva === filterSeva) &&
                (!filterDateRange ||
                    (filterDateRange.start && filterDateRange.end &&
                        itemDate >= new Date(filterDateRange.start) &&
                        itemDate <= new Date(filterDateRange.end))) &&
                (filterGivenRange.min === '' || item.given >= Number(filterGivenRange.min)) &&
                (filterGivenRange.max === '' || item.given <= Number(filterGivenRange.max)) &&
                (filterUsedRange.min === '' || item.used >= Number(filterUsedRange.min)) &&
                (filterUsedRange.max === '' || item.used <= Number(filterUsedRange.max))
            );
        });
        setFilteredData(filtered);
        setIsFilterPopupOpen(false);
    };

    const handleGivenRangeChange = (min, max) => {
        setFilterGivenRange({ min, max });
    };

    const handleUsedRangeChange = (min, max) => {
        setFilterUsedRange({ min, max });
    };

    return (
        <div className="reports-container">
            {/* <div className="reports-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft />
                </button>
                <h1 className="reports-header-name">Kitchen Stock</h1>
                <div className="header-icons right-icons">
                    <button className="icon-button" onClick={handleLanguageChange}>
                        <img
                            src="/assets/languages.png"
                            alt="Change Language"
                            className="icon"
                        />
                    </button>
                </div>
            </div> */}
            <Header
                currentLanguage={currentLanguage}
                handleLanguageChange={handleLanguageChange}
            />
            <div className="reports-subheader">
                <div className="report-title-container">
                    <h2>Reports</h2>
                </div>
                <button className="filter-button" onClick={() => setIsFilterPopupOpen(true)}>
                    <FaFilter /> Filter
                </button>
            </div>
            <FilterPopup
                isOpen={isFilterPopupOpen}
                onClose={() => setIsFilterPopupOpen(false)}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterName={filterName}
                setFilterName={setFilterName}
                filterSeva={filterSeva}
                setFilterSeva={setFilterSeva}
                filterDateRange={filterDateRange}
                setFilterDateRange={setFilterDateRange}
                uniqueCategories={uniqueCategories}
                uniqueNames={uniqueNames}
                uniqueSevas={uniqueSevas}
                handleFilter={handleFilter}
                filterGivenRange={filterGivenRange}
                setFilterGivenRange={setFilterGivenRange}
                filterUsedRange={filterUsedRange}
                setFilterUsedRange={setFilterUsedRange}
            />
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>SL No</th>
                            <th>Name</th>
                            <th>Unit</th>
                            <th>Quantity</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Seva</th>
                            <th>Given</th>
                            <th>Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.slNo}</td>
                                <td>{item.name}</td>
                                <td>{item.unit}</td>
                                <td>{item.quantity}</td>
                                <td>{item.category}</td>
                                <td>{item.date}</td>
                                <td>{item.seva}</td>
                                <td>{item.given}</td>
                                <td>{item.used}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportsPage;
