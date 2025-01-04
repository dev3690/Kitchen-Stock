import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../styles/ReportsPage.css';
import { FaFilter, FaArrowLeft } from 'react-icons/fa';
import FilterPopup from '../components/FilterPopup';
import Header from '../components/Header';
import { InputText } from 'primereact/inputtext';
import { callAxiosApi, getManageItemsData } from '../api_utils';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


// const reportData = [
//     { slNo: '01.', name: 'Wheat', unit: 'KG', quantity: 8, category: 'Grains', date: '2024-01-01', seva: '40', given: 10, used: 8 },
//     { slNo: '02.', name: 'Corn', unit: 'KG', quantity: 36, category: 'Grains', date: '2024-02-02', seva: '10', given: 40, used: 36 },
//     { slNo: '03.', name: 'Rice', unit: 'KG', quantity: 12, category: 'Grains', date: '2024-03-03', seva: '11', given: 15, used: 12 },
//     { slNo: '04.', name: 'Millet', unit: 'Liter', quantity: 25, category: 'Vegetables', date: '2024-04-04', seva: '9', given: 30, used: 25 },
//     { slNo: '05.', name: 'Buttermilk', unit: 'Liter', quantity: 5, category: 'Miscellaneous', date: '2024-05-05', seva: '20', given: 8, used: 5 },
//     { slNo: '06.', name: 'Barley', unit: 'KG', quantity: 14, category: 'Vegetables', date: '2024-06-06', seva: '30', given: 20, used: 14 },
//     { slNo: '07.', name: 'Oats', unit: 'KG', quantity: 9, category: 'Miscellaneous', date: '2024-07-07', seva: '14', given: 12, used: 9 },
//     { slNo: '08.', name: 'Pratik', unit: 'KG', quantity: 3, category: 'Miscellaneous', date: '2024-08-08', seva: '15', given: 5, used: 3 },
//     { slNo: '09.', name: 'Barley', unit: 'KG', quantity: 14, category: 'Vegetables', date: '2024-09-09', seva: '5', given: 18, used: 14 },
//     { slNo: '10.', name: 'Oats', unit: 'KG', quantity: 9, category: 'Miscellaneous', date: '2024-10-10', seva: '18', given: 15, used: 9 },
// ];

function ReportsPage({ currentLanguage, handleLanguageChange }) {
    const navigate = useNavigate();
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterSeva, setFilterSeva] = useState('');
    const [filterDateRange, setFilterDateRange] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [filterGivenRange, setFilterGivenRange] = useState({ min: 0, max: 75000 });
    const [filterUsedRange, setFilterUsedRange] = useState({ min: 0, max: 75000 });
    const [globalFilterPurchase, setGlobalFilterPurchase] = useState('');
    const [globalFilterUsage, setGlobalFilterUsage] = useState('');
    const [first1, setFirst1] = useState(0);
    const [first2, setFirst2] = useState(0);
    const [rows, setRows] = useState(5);
    const [addData, setAddData] = useState([]);
    const [removeData, setRemoveData] = useState([]);
    const [selectedSevaTypes, setSelectedSevaTypes] = useState({
        purchase: false,
        seva: false,
        used: false,
        given: false
    });
    const [filteredAddData, setFilteredAddData] = useState([]);
    const [filteredRemoveData, setFilteredRemoveData] = useState([]);
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [uniqueNames, setUniqueNames] = useState([]);

    const formatDate = (rowData) => {
        if (!rowData.date) return '';
        try {
            const date = new Date(rowData.date);
            if (isNaN(date.getTime())) return ''; // Return empty string for invalid dates
            
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-');
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const handleFilter = () => {
        const filterDataByType = (data) => {
            if (!Object.values(selectedSevaTypes).some(value => value)) {
                return data;
            }
            
            return data.filter(item => {
                const itemType = item.type?.toLowerCase() || '';
                return selectedSevaTypes[itemType];
            });
        };

        const isDateInRange = (dateStr) => {
            if (!filterDateRange || !filterDateRange.start || !filterDateRange.end) {
                return true;
            }

            try {
                // Parse the item date (assuming API date format)
                const itemDate = new Date(dateStr);
                
                // Parse start and end dates from the filter (dd-mm-yyyy format)
                const [startDay, startMonth, startYear] = filterDateRange.start.split('-');
                const [endDay, endMonth, endYear] = filterDateRange.end.split('-');
                
                const startDate = new Date(startYear, startMonth - 1, startDay);
                const endDate = new Date(endYear, endMonth - 1, endDay);

                // Set time to midnight for accurate comparison
                itemDate.setHours(0, 0, 0, 0);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);

                return itemDate >= startDate && itemDate <= endDate;
            } catch (error) {
                console.error('Error comparing dates:', error);
                return false;
            }
        };

        const filteredAdd = filterDataByType(addData).filter(item => {
            return (
                (filterCategory === '' || item.categoryName === filterCategory) &&
                (filterName === '' || item.itemName === filterName) &&
                isDateInRange(item.date)
            );
        });

        const filteredRemove = filterDataByType(removeData).filter(item => {
            return (
                (filterCategory === '' || item.categoryName === filterCategory) &&
                (filterName === '' || item.itemName === filterName) &&
                isDateInRange(item.date)
            );
        });

        setFilteredAddData(filteredAdd);
        setFilteredRemoveData(filteredRemove);
        setIsFilterPopupOpen(false);
    };

    const handleGivenRangeChange = (min, max) => {
        setFilterGivenRange({ min, max });
    };

    const handleUsedRangeChange = (min, max) => {
        setFilterUsedRange({ min, max });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getManageItemsData();
                setAddData(data.add);
                setRemoveData(data.remove);
                setFilteredAddData(data.add);
                setFilteredRemoveData(data.remove);

                const allData = [...data.add, ...data.remove];
                
                const categories = [...new Set(allData.map(item => item.categoryName))];
                setUniqueCategories(categories);

                const names = [...new Set(allData.map(item => item.itemName))];
                setUniqueNames(names);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filterDataByType = (data) => {
            if (!Object.values(selectedSevaTypes).some(value => value)) {
                return data;
            }
            
            return data.filter(item => {
                const itemType = item.type?.toLowerCase() || '';
                return selectedSevaTypes[itemType];
            });
        };

        setFilteredAddData(filterDataByType(addData));
        setFilteredRemoveData(filterDataByType(removeData));
    }, [selectedSevaTypes, addData, removeData]);

    const serialNumberTemplate = (rowData, props) => {
        return props.rowIndex + 1 + (props.paginator ? props.first : 0);
    };

    const onPageChange1 = (event) => {
        setFirst1(event.first);
        setRows(event.rows);
    };

    const onPageChange2 = (event) => {
        setFirst2(event.first);
        setRows(event.rows);
    };

    return (
        <div className="reports-container">
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
                handleFilter={handleFilter}
                filterGivenRange={filterGivenRange}
                setFilterGivenRange={setFilterGivenRange}
                filterUsedRange={filterUsedRange}
                setFilterUsedRange={setFilterUsedRange}
                selectedSevaTypes={selectedSevaTypes}
                setSelectedSevaTypes={setSelectedSevaTypes}
            />
            <div className="tables-wrapper">
                {/* Purchase Table */}
                <div className="table-container">
                    <h3>Add</h3>
                    <div className="table-header">
                        <span className="search-input">
                            <InputText
                                placeholder="Search..."
                                value={globalFilterPurchase}
                                onChange={(e) => setGlobalFilterPurchase(e.target.value)}
                            />
                        </span>
                    </div>
                    <DataTable 
                        value={filteredAddData}
                        scrollable 
                        scrollHeight="400px"
                        stripedRows
                        size="small"
                        paginator
                        rows={rows}
                        first={first1}
                        onPage={onPageChange1}
                        globalFilter={globalFilterPurchase}
                        sortMode="multiple"
                        removableSort
                        showGridlines
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    >
                        <Column 
                            header="Sr." 
                            body={serialNumberTemplate} 
                            style={{ minWidth: '70px' }}
                        />
                        <Column field="itemName" header="Name" style={{ minWidth: '100px' }} sortable />
                        <Column field="unit" header="Unit" style={{ minWidth: '70px' }} sortable />
                        <Column field="type" header="Type" style={{ minWidth: '80px' }} sortable />
                        <Column field="qty" header="Quantity" style={{ minWidth: '70px' }} sortable />
                        <Column field="location" header="Location" style={{ minWidth: '70px' }} sortable />
                        <Column field="categoryName" header="Category" style={{ minWidth: '100px' }} sortable />
                        <Column 
                            field="date" 
                            header="Date" 
                            style={{ minWidth: '130px' }} 
                            sortable
                            body={formatDate}
                            sortField="date"
                        />
                        <Column field="sevakName" header="SevakName" style={{ minWidth: '120px' }} sortable />
                        <Column field="sevakNo" header="No." style={{ minWidth: '120px' }} sortable />
                    </DataTable>
                </div>

                {/* Used Table */}
                <div className="table-container">
                    <h3>Remove</h3>
                    <div className="table-header">
                        <span className="search-input">
                            <InputText
                                placeholder="Search..."
                                value={globalFilterUsage}
                                onChange={(e) => setGlobalFilterUsage(e.target.value)}
                            />
                        </span>
                    </div>
                    <DataTable 
                        value={filteredRemoveData}
                        scrollable 
                        scrollHeight="400px"
                        stripedRows
                        size="small"
                        paginator
                        rows={rows}
                        first={first2}
                        onPage={onPageChange2}
                        globalFilter={globalFilterUsage}
                        sortMode="multiple"
                        removableSort
                        showGridlines
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    >
                        <Column 
                            header="Sr." 
                            body={serialNumberTemplate} 
                            style={{ minWidth: '70px' }}
                        />
                        <Column field="itemName" header="Name" style={{ minWidth: '100px' }} sortable />
                        <Column field="unit" header="Unit" style={{ minWidth: '70px' }} sortable />
                        <Column field="type" header="Type" style={{ minWidth: '80px' }} sortable />
                        <Column field="qty" header="Quantity" style={{ minWidth: '70px' }} sortable />
                        <Column field="location" header="Location" style={{ minWidth: '70px' }} sortable />
                        <Column field="categoryName" header="Category" style={{ minWidth: '100px' }} sortable />
                        <Column 
                            field="date" 
                            header="Date" 
                            style={{ minWidth: '130px' }} 
                            sortable
                            body={formatDate}
                            sortField="date"
                        />
                        <Column field="sevakName" header="SevakName" style={{ minWidth: '120px' }} sortable />
                        <Column field="sevakNo" header="No." style={{ minWidth: '120px' }} sortable />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;
