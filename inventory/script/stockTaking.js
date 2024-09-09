// stockIssue.js
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

document.getElementById('stock-taking-form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveChanges();
});

function initializePage() {
    populateProductNames();
 
    loadStockTaking();
    
    // Add event listener for the "Select All" checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleAllProducts);
    }
    
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteSelectedItems);
    }
}

// Global variables
let stockTaking = [];
let isAmendMode = false;
let selectedStockTakingIndex = -1;

// Function to toggle amend mode
function toggleAmendMode() {
    isAmendMode = document.getElementById('amend').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
    const fields = ['tradeDate','productName','stockInRecord','verifedStockTaking'];
    fields.forEach(field => document.getElementById(field).value = '');
    document.getElementById('amend').checked = false;
    isAmendMode = false;
    selectedStockTakingIndex = -1;
}

// Function to update the table with current stock issues
function updateTable() {
    const tableBody = document.querySelector('#StockTaking-table tbody');
    tableBody.innerHTML = '';

    stockTaking.forEach((issue, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${issue.tradeDate}</td>
            <td>${issue.productName}</td>
            <td>${issue.stockInRecords}</td>
            <td>${issue.verifedStockTaking}</td>     
               
        `;
        row.addEventListener('click', () => selectStockTaking(index));
    });
}

// Function to select a stock issue for editing
function selectStockTaking(index) {
    const issue = stockTaking[index];
    const fields = ['tradeDate','productName','stockInRecord','verifedStockTaking'];
    fields.forEach(field => document.getElementById(field).value = issue[field]);
    document.getElementById('amend').checked = true;
    isAmendMode = true;
    selectedStockTakingIndex = index;
}

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#StockTaking-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}

// Function to populate product names
function populateProductNames() {
    const productNameDropdown = document.getElementById('productName');
    
    // Fetch the product data from localStorage using the correct key
    const savedProducts = localStorage.getItem('products');
    
    if (savedProducts) {
        const products = JSON.parse(savedProducts);
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            productNameDropdown.appendChild(option);
        });
    } else {
        console.error('No products found in localStorage');
    }
}

// Add this function to load stock issues
function loadStockTaking() {
    const savedStockTaking = localStorage.getItem('stockTaking');
    if (savedStockTaking) {
        stockTaking = JSON.parse(savedStockTaking);
        updateTable();
    }
}

// Function to save changes
function saveChanges() {
    const tradeDate = document.getElementById('tradeDate').value;   
    const productName = document.getElementById('productName').value;
    const stockInRecords = document.getElementById('stockInRecord').value;
    const verifedStockTaking = document.getElementById('verifedStockTaking').value;

    if (!productName|| !tradeDate ||  !stockInRecords || !verifedStockTaking) {
        alert('Please fill in Product Name, Trade Date, Stock In Records, and Verifed Stock Taking fields');
        return;
    }

    const newStockTaking = {
        productName,
        tradeDate,
        stockInRecords,
        verifedStockTaking
    };

    if (isAmendMode && selectedStockTakingIndex !== -1) {
        stockTaking[selectedStockTakingIndex] = newStockTaking;
    } else {
        stockTaking.push(newStockTaking);
    }

    localStorage.setItem('stockTaking', JSON.stringify(stockTaking));
    updateTable();
    clearForm();
    //alert('Stock issue saved successfully');
}

// Add these new functions
function toggleAllProducts(event) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = event.target.checked;
    });
}

function deleteSelectedItems() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const indicesToRemove = Array.from(selectedCheckboxes).map(checkbox => 
        parseInt(checkbox.getAttribute('data-index'))
    ).sort((a, b) => b - a);

    indicesToRemove.forEach(index => {
        stockTaking.splice(index, 1);
    });

    localStorage.setItem('stockTaking', JSON.stringify(stockTaking));
    updateTable();
}
