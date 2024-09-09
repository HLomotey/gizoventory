// stockIssue.js
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

document.getElementById('stock-received-form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveChanges();
});

function initializePage() {
    populateProductNames();
    populateSuppliers();
    loadStockReceived();
    
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
let stockReceived = [];
let isAmendMode = false;
let selectedStockReceivedIndex = -1;

// Function to toggle amend mode
function toggleAmendMode() {
    isAmendMode = document.getElementById('amend').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
    const fields = ['productName', 'tradeDate', 'receivedQuantity', 'supplier','price','voucherNumber','wayBill'];
    fields.forEach(field => document.getElementById(field).value = '');
    document.getElementById('amend').checked = false;
    isAmendMode = false;
    selectedStockReceivedIndex = -1;
}

// Function to update the table with current stock issues
function updateTable() {
    const tableBody = document.querySelector('#StockReceived-table tbody');
    tableBody.innerHTML = '';

    stockReceived.forEach((issue, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${issue.productName}</td>
            <td>${issue.tradeDate}</td>
            <td>${issue.receivedQuantity}</td>
            <td>${issue.supplier}</td>     
            <td>${issue.price}</td>         
            <td>${issue.voucherNumber}</td>         
            <td>${issue.wayBill}</td>         
        `;
        row.addEventListener('click', () => selectStockReceived(index));
    });
}

// Function to select a stock issue for editing
function selectStockReceived(index) {
    const issue = stockReceived[index];
    const fields = ['productName', 'tradeDate', 'receivedQuantity', 'supplier','price','voucherNumber','wayBill'];
    fields.forEach(field => document.getElementById(field).value = issue[field]);
    document.getElementById('amend').checked = true;
    isAmendMode = true;
    selectedStockReceivedIndex = index;
}

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#StockReceived-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}


// Function to populate product names
function populateProductNames() {
    const productNameDropdown = document.getElementById('productName');
    
    // Clear existing options
    productNameDropdown.innerHTML = '';
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a product';
    productNameDropdown.appendChild(defaultOption);
    
    // Fetch the product data from localStorage
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

// Function to populate suppliers
function populateSuppliers() {
    const supplierDropdown = document.getElementById('supplier');
    
    // Clear existing options
    supplierDropdown.innerHTML = '';
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a supplier';
    supplierDropdown.appendChild(defaultOption);
    
    // Fetch the supplier data from localStorage
    const savedSuppliers = localStorage.getItem('suppliers');
    
    if (savedSuppliers) {
        const suppliers = JSON.parse(savedSuppliers);
        
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.supplier; // Assuming 'supplier' is the name field
            option.textContent = supplier.supplier;
            supplierDropdown.appendChild(option);
        });
    } else {
        console.error('No suppliers found in localStorage');
    }
}

// Add this function to load stock issues
function loadStockReceived() {
    const savedStockReceived = localStorage.getItem('stockReceived');
    if (savedStockReceived) {
        stockReceived = JSON.parse(savedStockReceived);
        updateTable();
    }
}

// Function to save changes
function saveChanges() {
    const productName = document.getElementById('productName').value;
    const tradeDate = document.getElementById('tradeDate').value;   
    const receivedQuantity = document.getElementById('receivedQuantity').value;
    const supplier = document.getElementById('supplier').value;
    const price = document.getElementById('price').value;
    const voucherNumber = document.getElementById('voucherNumber').value;
    const wayBill = document.getElementById('wayBill').value;

    if (!productName|| !tradeDate ||  !receivedQuantity || !supplier) {
        alert('Please fill in Product Name, Trade Date, Received Quantity, and Supplier fields');
        return;
    }

    const newStockReceived = {
        productName,
        tradeDate,
        receivedQuantity,
        supplier,
        price,
        voucherNumber,
        wayBill
    };

    if (isAmendMode && selectedStockReceivedIndex !== -1) {
        stockReceived[selectedStockReceivedIndex] = newStockReceived;
    } else {
        stockReceived.push(newStockReceived);
    }

    localStorage.setItem('stockReceived', JSON.stringify(stockReceived));
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
        stockReceived.splice(index, 1);
    });

    localStorage.setItem('stockReceived', JSON.stringify(stockReceived));
    updateTable();
}
