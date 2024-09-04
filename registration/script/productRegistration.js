document.addEventListener('DOMContentLoaded', function() {
    populateProductCategories();
    updateTable();

    document.querySelector('#productCategory').addEventListener('change', function() {
        window.location.href = './productCategory.html';
    });

    // Add event listener for the new amend checkbox
    document.getElementById('amend').addEventListener('change', toggleAmendMode);

    // Add event listener for the select all checkbox
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#products-table tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = this.checked);
    });

    // Add event listener for the delete button
    document.getElementById('deleteButton').addEventListener('click', deleteSelectedProducts);
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
/*
function navigate(page) {
    // Implement navigation logic here
    console.log(`Navigating to ${page}`);
}
*/

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
    document.getElementById('amend').checked = false; // Uncheck the amend checkbox
    isAmendMode = false;
    selectedProductIndex = -1;
}

// Function to update the table with current products
function updateTable() {
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${product.category}</td>
            <td>${product.name}</td>
            <td>${product.unitOfIssue}</td>
            <td>${product.reorderQuantity}</td>
        `;
        row.addEventListener('click', (event) => {
            if (event.target.type !== 'checkbox') {
                selectProduct(index);
            }
        });
        tableBody.appendChild(row);
    });
}

// Function to select a product for editing
function selectProduct(index) {
    const product = products[index];
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productName').value = product.name;
    document.getElementById('unitOfIssue').value = product.unitOfIssue;
    document.getElementById('reorderQuantity').value = product.reorderQuantity;
    document.getElementById('amend').checked = true; // Check the amend checkbox
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

// Add this new function to get selected products
function getSelectedProducts() {
    const checkboxes = document.querySelectorAll('#products-table tbody input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => products[checkbox.dataset.index]);
}

// Add this new function to delete selected products
function deleteSelectedProducts() {
    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length === 0) {
        alert('Please select at least one product to delete.');
        return;
    }

    if (confirm(`Are you sure you want to delete ${selectedProducts.length} selected product(s)?`)) {
        products = products.filter(product => !selectedProducts.includes(product));
        localStorage.setItem('products', JSON.stringify(products));
        updateTable();
        clearForm();
    }
}
