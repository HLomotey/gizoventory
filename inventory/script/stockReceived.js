document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

document.getElementById('stock-issues-form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveChanges();
});

function initializePage() {
    populateProductNames();
    populateSuppliers();
    updateTable();
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
    const fields = ['productName', 'tradeDate', 'receivedQuantity', 'supplier', 'issuedQuantity', 'price', 'voucherNumber', 'wayBillNumber'];
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
            <td>${issue.productName}</td>
            <td>${issue.tradeDate}</td>
            <td>${issue.issuedQuantity}</td>
            <td>${issue.receivedQuantity}</td>
            <td>${issue.supplier}</td>
            <td>${issue.price}</td>
            <td>${issue.voucherNumber}</td>
            <td>${issue.wayBillNumber}</td>
        `;
        row.addEventListener('click', () => selectStockIssue(index));
    });
}

// Function to select a stock issue for editing
function selectStockIssue(index) {
    const issue = stockIssues[index];
    const fields = ['productName', 'tradeDate', 'receivedQuantity', 'supplier', 'issuedQuantity', 'price', 'voucherNumber', 'wayBillNumber'];
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
    populateSelectOptions('productName', 'productNames');
}

// Function to populate suppliers
function populateSuppliers() {
    populateSelectOptions('supplier', 'suppliers');
}

// Helper function to populate select options from localStorage
function populateSelectOptions(selectId, storageKey) {
    const select = document.getElementById(selectId);
    select.innerHTML = ''; // Clear existing options

    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });

    if (items.length === 0) {
        console.warn(`No ${storageKey} found in localStorage.`);
    }
}

// Call initializePage when the page loads
window.onload = initializePage;

// Add an event listener to update product names and suppliers when returning to this page
window.addEventListener('focus', initializePage);
