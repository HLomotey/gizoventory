let selectedRow = null;

function addCategory(categoryName) {
    const table = document.getElementById("departmentTable");
    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.innerText = categoryName;

    // Add event listener to the row for selection
    row.addEventListener('click', () => selectRow(row));

    // Save categories to localStorage after adding
    saveCategoriesToLocalStorage();
}

function saveChanges() {
    const categoryName = document.getElementById('departmentInput').value.trim();
    if (document.getElementById("amend").checked && selectedRow) {
        selectedRow.cells[0].innerText = categoryName;
    } else {
        addCategory(categoryName);
    }

    // Clear the input field
    document.getElementById('departmentInput').value = "";
    selectedRow = null;

    // Save categories to localStorage
    saveCategoriesToLocalStorage();
}

function filterTable() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const table = document.getElementById("departmentTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].getElementsByTagName("td")[0];
        if (cell) {
            if (cell.innerText.toLowerCase().includes(searchInput)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

function toggleAmendMode() {
    const amendMode = document.getElementById("amend").checked;
    if (!amendMode) {
        selectedRow = null;
        document.getElementById('departmentInput').value = "";
    }
}

function selectRow(row) {
    if (document.getElementById("amend").checked) {
        selectedRow = row;
        document.getElementById('departmentInput').value = row.cells[0].innerText;
    }
}

function deleteCategory() {
    if (selectedRow) {
        selectedRow.remove();
        document.getElementById('departmentInput').value = "";
        selectedRow = null;

        // Save categories to localStorage after deleting
        saveCategoriesToLocalStorage();
    }
}

function saveCategoriesToLocalStorage() {
    const table = document.getElementById("departmentTable");
    const rows = table.getElementsByTagName("tr");
    const categories = [];

    for (let i = 1; i < rows.length; i++) { // Skip header row
        categories.push(rows[i].cells[0].innerText);
    }

    localStorage.setItem('departments', JSON.stringify(categories));
}

function loadCategoriesFromLocalStorage() {
    const categories = JSON.parse(localStorage.getItem('departments') || '[]');
    const table = document.getElementById("departmentTable");

    categories.forEach(category => {
        const row = table.insertRow();
        const cell = row.insertCell(0);
        cell.innerText = category;

        // Add event listener to the row for selection
        row.addEventListener('click', () => selectRow(row));
    });
}

// Call loadCategoriesFromLocalStorage when the page loads
window.onload = loadCategoriesFromLocalStorage;
/*
function navigate(page) {
    switch(page) {
        case 'ProductCategory':
            window.location.href = './ProductCategory.html';
            break;
        case 'ProductRegistration':
            window.location.href = './ProductRegistration.html';
            break;
        case 'Suppliers':
            window.location.href = './Suppliers.html';
            break;
        case 'Department':
            window.location.href = './Department.html';
            break;
    }
}
    */

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveButton').addEventListener('click', saveChanges);
    document.getElementById('deleteButton').addEventListener('click', deleteCategory);
    document.getElementById('amend').addEventListener('change', toggleAmendMode);
    document.getElementById('search-input').addEventListener('input', filterTable);
});
