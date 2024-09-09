// stockIssue.js
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

document.getElementById('stock-issues-form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveChanges();
});

function initializePage() {
    populateProductNames();
    populateDepartment();
    loadStockIssues();
    
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
let stockIssues = [];
let isAmendMode = false;
let selectedStockIssueIndex = -1;

// Function to toggle amend mode
function toggleAmendMode() {
    isAmendMode = document.getElementById('amend').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
    const fields = ['productName', 'tradeDate', 'department', 'issuedQuantity','voucherNumber'];
    fields.forEach(field => document.getElementById(field).value = '');
    document.getElementById('amend').checked = false;
    isAmendMode = false;
    selectedStockIssueIndex = -1;
}

// Function to update the table with current stock issues
function updateTable() {
    const tableBody = document.querySelector('#StockIssues-table tbody');
    tableBody.innerHTML = '';

    stockIssues.forEach((issue, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${issue.productName}</td>
            <td>${issue.tradeDate}</td>
            <td>${issue.department}</td>
            <td>${issue.issuedQuantity}</td>     
            <td>${issue.voucherNumber}</td>         
        `;
        row.addEventListener('click', () => selectStockIssue(index));
    });
}

// Function to select a stock issue for editing
function selectStockIssue(index) {
    const issue = stockIssues[index];
    const fields = ['productName', 'tradeDate', 'department', 'issuedQuantity','voucherNumber'];
    fields.forEach(field => document.getElementById(field).value = issue[field]);
    document.getElementById('amend').checked = true;
    isAmendMode = true;
    selectedStockIssueIndex = index;
}

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#StockIssues-table tbody tr');

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

// Function to populate departments
function populateDepartment() {
    const departmentDropdown = document.getElementById('department');
    
    // Fetch the department data from localStorage
    const savedDepartments = localStorage.getItem('departments');
    
    if (savedDepartments) {
        const departments = JSON.parse(savedDepartments);
        
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.name;
            option.textContent = department.name;
            departmentDropdown.appendChild(option);
        });
    } else {
        console.error('No departments found in localStorage');
    }
}

// Add this function to load stock issues
function loadStockIssues() {
    const savedStockIssues = localStorage.getItem('stockIssues');
    if (savedStockIssues) {
        stockIssues = JSON.parse(savedStockIssues);
        updateTable();
    }
}

// Function to save changes
function saveChanges() {
    const productName = document.getElementById('productName').value;
    const tradeDate = document.getElementById('tradeDate').value;   
    const issuedQuantity = document.getElementById('issuedQuantity').value;
    const department = document.getElementById('department').value;
    const voucherNumber = document.getElementById('voucherNumber').value;

    if (!productName|| !tradeDate ||  !issuedQuantity || !department) {
        alert('Please fill in Product Name, Trade Date, Issued Quantity, and Department fields');
        return;
    }

    const newStockIssue = {
        productName,
        tradeDate,
        department,
        issuedQuantity,
        voucherNumber
    };

    if (isAmendMode && selectedStockIssueIndex !== -1) {
        stockIssues[selectedStockIssueIndex] = newStockIssue;
    } else {
        stockIssues.push(newStockIssue);
    }

    localStorage.setItem('stockIssues', JSON.stringify(stockIssues));
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
        stockIssues.splice(index, 1);
    });

    localStorage.setItem('stockIssues', JSON.stringify(stockIssues));
    updateTable();
}
