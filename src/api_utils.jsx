import axios from "axios"

// const localApiUrl = "http://27.116.52.24:8060" // live server
const localApiUrl = "http://192.168.29.73:3690" // local server
// const localApiUrl = "http://localhost:3690" // local server

// API endpoints
const loginApi = `${localApiUrl}/login`
const categoryApi = `${localApiUrl}/category`
const dashboardApi = `${localApiUrl}/dashboard`
const getTableData = `${localApiUrl}/getData`
const assignItemToPradesh = `${localApiUrl}/assignItemToPradesh`
const getPradeshItemsDetails = (id) => `${localApiUrl}/getPradeshItemsDetails`
const getManageItemsByItemId = `${localApiUrl}/getManageItemsByItemId`
const getManageItems = `${localApiUrl}/getManageItems`

const headers = {
    'Content-Type': 'application/json'
}

// Common function to make API calls
const callAxiosApi = async (url = "", body = {}, responseType = 'json') => {
    const token = localStorage.getItem('token');
    
    const config = {
        method: 'post',
        url,
        headers: {
            ...headers,
            ...(token && { Authorization: `Bearer ${token}` })
        },
        data: JSON.stringify(body),
        responseType
    };

    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        throw error;
    }
};

const getCategoryData = async () => {
  try {
    const response = await callAxiosApi(getTableData, { table: "category" });
    if (!response.data.errorStatus) {
      return response.data.data;
    }
    throw new Error('Failed to fetch category data');
  } catch (error) {
    console.error('Error fetching category data:', error);
    throw error;
  }
};

const getItemData = async (categoryId) => {
  try {
    const response = await callAxiosApi(getTableData, { 
      table: "item",
      categoryId: categoryId
    });
    
    if (!response.data.errorStatus) {
      const items = response.data.data;
      return Array.isArray(items) 
        ? items.filter(item => item.categoryId === categoryId)
        : [];
    }
    throw new Error('Failed to fetch item data');
  } catch (error) {
    console.error('Error fetching item data:', error);
    throw error;
  }
};

const insertItemData = async (itemData) => {
  try {
    const response = await callAxiosApi(`${localApiUrl}/insertData`, {
      table: "item",
      ...itemData
    });
    
    if (!response.data.errorStatus) {
      return response.data;
    }
    throw new Error('Failed to insert item data');
  } catch (error) {
    console.error('Error inserting item data:', error);
    throw error;
  }
};

const manageItem = async (itemData) => {
  try {
    const response = await callAxiosApi(`${localApiUrl}/manageitem`, itemData);
    if (!response.data.errorStatus) {
      return response.data;
    }
    throw new Error('Failed to manage item');
  } catch (error) {
    console.error('Error managing item:', error);
    throw error;
  }
};

const getTransactionHistory = async (itemId) => {
  try {
    const response = await callAxiosApi(getManageItemsByItemId, {
      itemId: itemId.toString()
    });
    
    if (!response.data.errorStatus) {
      return response.data.data.map(item => ({
        manageId: item.manageId,
        itemName: item.itemName,
        unit: item.unit,
        qty: item.qty,
        date: item.date,
        type: item.type,
        sevakName: item.sevakName,
        sevakNo: item.sevakNo,
        gujName: item.gujName,
        categoryName: item.categoryName,
        itemTo: item.itemTo
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};

const getManageItemsData = async () => {
  try {
    const response = await callAxiosApi(getManageItems);
    if (!response.data.errorStatus) {
      return {
        add: response.data.data.add || [],
        remove: response.data.data.remove || []
      };
    }
    return { add: [], remove: [] };
  } catch (error) {
    console.error('Error fetching manage items:', error);
    return { add: [], remove: [] };
  }
};

export {
    loginApi,
    dashboardApi,
    callAxiosApi,
    getPradeshItemsDetails,
    getTableData,
    assignItemToPradesh,
    categoryApi,
    getCategoryData,
    getItemData,
    insertItemData,
    manageItem,
    getTransactionHistory,
    getManageItemsData
}
