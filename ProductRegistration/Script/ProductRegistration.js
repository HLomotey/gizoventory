document.addEventListener('DOMContentLoaded', function() {
    populateProductCategories();
    updateTable();

   document.querySelector('#productCategory').addEventListener('change', function() {
       window.location.href = './ProductCategory.html';
    });
});

document.getElementById('product-registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    saveChanges();
});

function saveChanges() {
    const productCategory = document.getElementById('productCategory').value;
    const productName = document.getElementById('productName').value;
    const unitOfIssue = document.getElementById('unitOfIssue').value;
    const reorderQuantity = document.getElementById('reorderQuantity').value;
    const productImage = document.getElementById('productImage').files[0];

    if (!productCategory || !productName) {
        alert('Please fill in the product name and category.');
        return;
    }

    const product = {
        category: productCategory,
        name: productName,
        unitOfIssue: unitOfIssue,
        reorderQuantity: reorderQuantity,
        image: productImage ? URL.createObjectURL(productImage) : null
    };

    if (isAmendMode && selectedProductIndex > -1) {
        // Update existing product
        products[selectedProductIndex] = product;
    } else {
        // Add new product
        products.push(product);
    }

    // Save products to local storage
    localStorage.setItem('products', JSON.stringify(products));

    updateTable();
    clearForm();
    
}

// Global variables
let products = JSON.parse(localStorage.getItem('products') || '[]');
let isAmendMode = false;
let selectedProductIndex = -1;

// Function to navigate between pages
function navigate(page) {
    // Implement navigation logic here
    console.log(`Navigating to ${page}`);
}

// Function to toggle amend mode
function toggleAmendMode() {
    isAmendMode = document.getElementById('amend').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
    document.getElementById('productCategory').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('unitOfIssue').value = '';
    document.getElementById('reorderQuantity').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('amend').checked = false;
    isAmendMode = false;
    selectedProductIndex = -1;
}

// Function to update the table with current products
function updateTable() {
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${product.category}</td>
            <td>${product.name}</td>
            <td>${product.unitOfIssue}</td>
            <td>${product.reorderQuantity}</td>
        `;
        row.addEventListener('click', () => selectProduct(index));
    });
}

// Function to select a product for editing
function selectProduct(index) {
    const product = products[index];
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productName').value = product.name;
    document.getElementById('unitOfIssue').value = product.unitOfIssue;
    document.getElementById('reorderQuantity').value = product.reorderQuantity;
    document.getElementById('amend').checked = true;
    isAmendMode = true;
    selectedProductIndex = index;
}

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#products-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}

// Function to populate product categories
function populateProductCategories() {
    const select = document.getElementById('productCategory');
    select.innerHTML = ''; // Clear existing options

    // Get categories from localStorage
    const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    if (categories.length === 0) {
        console.warn('No categories found in localStorage.');
    }
}

// Function to observe changes in the category table
function observeCategoryTable() {
    const categoryTable = document.getElementById('categoryTable');
    if (!categoryTable) {
        console.warn('Category table not found. This is expected on the Product Registration page.');
        return;
    }

    const observer = new MutationObserver(() => {
        populateProductCategories();
    });

    observer.observe(categoryTable, { childList: true, subtree: true });
}

// Update the init function to load products from local storage
function init() {
    // Load products from local storage
    products = JSON.parse(localStorage.getItem('products') || '[]');

    populateProductCategories();
    observeCategoryTable(); // Add this line
    updateTable();
}

// Call init when the page loads
window.onload = init;

// Add an event listener to update categories when returning to this page
window.addEventListener('focus', populateProductCategories);

// Debug code to check tab visibility
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tabs a');
    tabs.forEach(tab => {
        console.log(`Tab "${tab.textContent}" is visible:`, tab.offsetParent !== null);
    });
});
