let selectedRow = null;

function loadProductCategories() {
    const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
    const tableBody = document.querySelector('#categoryTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    categories.forEach(category => {
        const row = document.createElement('tr');
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('rowCheckbox');
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        row.appendChild(categoryCell);

        tableBody.appendChild(row);
    });

    updateSelectAllCheckbox();
}

function addProductCategory(categoryName) {
    const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
    categories.push(categoryName);
    localStorage.setItem('productCategories', JSON.stringify(categories));
    loadProductCategories();
}

function saveChanges() {
    const categoryName = document.getElementById('categoryInput').value.trim();
    if (categoryName === '') return;

    if (document.getElementById("amend").checked && selectedRow) {
        const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
        const index = Array.from(selectedRow.parentNode.children).indexOf(selectedRow) - 1;
        categories[index] = categoryName;
        localStorage.setItem('productCategories', JSON.stringify(categories));
    } else {
        addProductCategory(categoryName);
    }

    document.getElementById('categoryInput').value = "";
    selectedRow = null;
    loadProductCategories();
}

function filterTable() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const rows = document.querySelectorAll('#categoryTable tbody tr');

    rows.forEach(row => {
        const categoryName = row.cells[1].textContent.toLowerCase();
        row.style.display = categoryName.includes(searchInput) ? "" : "none";
    });
}

function toggleAmendMode() {
    const amendMode = document.getElementById("amend").checked;
    if (!amendMode) {
        selectedRow = null;
        document.getElementById('categoryInput').value = "";
    }
}

function selectRow(row) {
    if (document.getElementById("amend").checked) {
        selectedRow = row;
        document.getElementById('categoryInput').value = row.cells[1].textContent;
    }
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    selectAllCheckbox.checked = checkboxes.length > 0 && Array.from(checkboxes).every(checkbox => checkbox.checked);
}

function toggleAllCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Call loadProductCategories when the page loads
window.onload = function() {
    loadProductCategories();
    
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.addEventListener('change', toggleAllCheckboxes);
};

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveButton').addEventListener('click', saveChanges);
    document.getElementById('amend').addEventListener('change', toggleAmendMode);
    document.getElementById('search-input').addEventListener('input', filterTable);
    
    document.querySelector('#categoryTable tbody').addEventListener('click', function(e) {
        if (e.target.tagName === 'TD') {
            selectRow(e.target.parentElement);
        }
    });

    document.querySelector('#categoryTable tbody').addEventListener('change', function(e) {
        if (e.target.classList.contains('rowCheckbox')) {
            updateSelectAllCheckbox();
        }
    });

    document.getElementById('deleteButton').addEventListener('click', deleteSelectedItems);
});

// Add this function to your existing JavaScript file

function deleteSelectedItems() {
    const checkboxes = document.querySelectorAll('#categoryTable .rowCheckbox:checked');
    if (checkboxes.length === 0) {
        showMessage('Please select at least one item to delete.');
        return;
    }

    if (confirm(`Are you sure you want to delete ${checkboxes.length} selected item(s)?`)) {
        const categories = JSON.parse(localStorage.getItem('productCategories') || '[]');
        const indicesToRemove = Array.from(checkboxes).map(checkbox => 
            Array.from(checkbox.closest('tr').parentNode.children).indexOf(checkbox.closest('tr'))
        ).sort((a, b) => b - a);

        indicesToRemove.forEach(index => {
            categories.splice(index, 1);
        });

        localStorage.setItem('productCategories', JSON.stringify(categories));
        loadProductCategories();
        showMessage(`${checkboxes.length} item(s) have been deleted.`);
    }
}

function showMessage(message) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.style.display = 'block';
}

function closeMessage() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'none';
}

// Add this to your existing DOMContentLoaded event listener
document.getElementById('messageClose').addEventListener('click', closeMessage);
