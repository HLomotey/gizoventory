document.addEventListener('DOMContentLoaded', function() {
    init();

    const productRegistrationForm = document.getElementById('product-registration-form');
    if (productRegistrationForm) {
        productRegistrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            saveChanges();
        });
    }

    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#products-table tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        });
    }

    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteSelectedProducts);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterTable);
    }

    const amendCheckbox = document.getElementById('amend');
    if (amendCheckbox) {
        amendCheckbox.addEventListener('change', toggleAmendMode);
    }
});

let products = [];
let isAmendMode = false;
let selectedProductIndex = -1;

function init() {
    products = JSON.parse(localStorage.getItem('products') || '[]');
    populateProductCategories();
    updateTable();
}

function saveChanges() {
    const category = document.getElementById('productCategoryatreg').value;
    const name = document.getElementById('main-product-name').value;
    const unitOfIssue = document.getElementById('unitOfIssue').value;
    const reorderQuantity = document.getElementById('reorderQuantity').value;

    if (!category || !name ) {
        alert('Please fill Product Category and Product Name to proceed');
        return;
    }

    const newProduct = { category, name, unitOfIssue, reorderQuantity };

    if (isAmendMode && selectedProductIndex !== -1) {
        products[selectedProductIndex] = newProduct;
    } else {
        products.push(newProduct);
    }

    localStorage.setItem('products', JSON.stringify(products));
    updateTable();
    clearForm();
}

function getSelectedProducts() {
    const checkboxes = document.querySelectorAll('#products-table tbody input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.index));
}

function deleteSelectedProducts() {
    const selectedIndexes = getSelectedProducts();
    if (selectedIndexes.length === 0) {
        alert('Please select at least one product to delete.');
        return;
    }

    if (confirm(`Are you sure you want to delete ${selectedIndexes.length} selected product(s)?`)) {
        products = products.filter((_, index) => !selectedIndexes.includes(index));
        localStorage.setItem('products', JSON.stringify(products));
        updateTable();
        clearForm();
    }
}

function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#products-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}

function toggleAmendMode() {
    isAmendMode = document.getElementById('amend').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

function clearForm() {
    document.getElementById('productCategoryatreg').value = '';
    document.getElementById('main-product-name').value = '';
    document.getElementById('unitOfIssue').value = '';
    document.getElementById('reorderQuantity').value = '';
    document.getElementById('amend').checked = false;
    isAmendMode = false;
    selectedProductIndex = -1;
}

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

function selectProduct(index) {
    const product = products[index];
    document.getElementById('productCategoryatreg').value = product.category;
    document.getElementById('main-product-name').value = product.name;
    document.getElementById('unitOfIssue').value = product.unitOfIssue;
    document.getElementById('reorderQuantity').value = product.reorderQuantity;
    document.getElementById('amend').checked = true;
    isAmendMode = true;
    selectedProductIndex = index;
}

function populateProductCategories() {
    const select = document.getElementById('productCategoryatreg');
    select.innerHTML = '';

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
