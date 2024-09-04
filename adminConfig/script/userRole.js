let selectedRow = null;

function getOrCreateTable() {
    let table = document.getElementById("userRoleTable");
    if (!table) {
        console.log("Table not found, creating a new one");
        table = document.createElement("table");
        table.id = "userRoleTable";
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = "20px";
        
        // Create table header
        let header = table.createTHead();
        let headerRow = header.insertRow(0);
        let th = document.createElement("th");
        th.innerHTML = "User Roles";
        th.style.backgroundColor = "#f2f2f2";
        th.style.padding = "12px";
        th.style.textAlign = "left";
        headerRow.appendChild(th);

        // Append table to a container or body
        const container = document.getElementById("tableContainer") || document.body;
        container.appendChild(table);
    }
    return table;
}

function addCategory(categoryName) {
    console.log("Adding category:", categoryName);
    const table = document.getElementById("userRoleTable");
    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.innerText = categoryName;

    // Add event listener to the row for selection
    row.addEventListener('click', () => selectRow(row));

    // Save categories to localStorage after adding
    saveCategoriesToLocalStorage();
    console.log("Category added successfully");
}

// Move this function inside the DOMContentLoaded event listener
function saveChanges() {
    console.log("saveChanges function called");
    const categoryName = document.getElementById('userRoleInput').value.trim();
    console.log("Category name:", categoryName);
    
    if (categoryName === "") {
        console.log("Category name is empty, not saving");
        return;
    }

    if (document.getElementById("amend").checked && selectedRow) {
        console.log("Amending existing row");
        selectedRow.cells[0].innerText = categoryName;
    } else {
        console.log("Adding new category");
        addCategory(categoryName);
    }

    // Clear the input field
    document.getElementById('userRoleInput').value = "";
    selectedRow = null;

    // Save categories to localStorage
    saveCategoriesToLocalStorage();
    console.log("Changes saved and table updated");
}

function filterTable() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const table = document.getElementById("userRoleTable");
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
        document.getElementById('userRoleInput').value = "";
    }
}

function selectRow(row) {
    if (document.getElementById("amend").checked) {
        selectedRow = row;
        document.getElementById('userRoleInput').value = row.cells[0].innerText;
    }
}

function deleteCategory() {
    if (selectedRow) {
        selectedRow.remove();
        document.getElementById('userRoleInput').value = "";
        selectedRow = null;

        // Save categories to localStorage after deleting
        saveCategoriesToLocalStorage();
    }
}

function saveCategoriesToLocalStorage() {
    const table = document.getElementById("userRoleTable");
    const rows = table.getElementsByTagName("tr");
    const categories = [];

    for (let i = 1; i < rows.length; i++) { // Skip header row
        categories.push(rows[i].cells[0].innerText);
    }

    localStorage.setItem('userRoles', JSON.stringify(categories));
    console.log("Categories saved to localStorage:", categories);
}

function loadCategoriesFromLocalStorage() {
    const categories = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const table = document.getElementById("userRoleTable");

    // Clear existing rows (except header)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

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

// Modify the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        console.log("Save button found");
        saveButton.addEventListener('click', function(event) {
            console.log("Save button clicked");
            event.preventDefault(); // Prevent form submission if it's in a form
            saveChanges();
        });
    } else {
        console.error("Save button not found");
    }

    // Initialize the table and display existing categories
    loadCategoriesFromLocalStorage();

    const userRoleTable = document.getElementById("userRoleTable");
    if (!userRoleTable) {
        console.error("Table with id 'userRoleTable' not found");
    }

    const amendCheckbox = document.getElementById('amend');
    if (amendCheckbox) {
        amendCheckbox.addEventListener('change', toggleAmendMode);
    } else {
        console.error("Amend checkbox not found");
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterTable);
    } else {
        console.error("Search input not found");
    }
});

function updateTableDisplay() {
    const table = getOrCreateTable();
    const categories = JSON.parse(localStorage.getItem('userRoles') || '[]');

    // Clear existing rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Add categories to the table
    categories.forEach(category => {
        const row = table.insertRow();
        const cell = row.insertCell(0);
        cell.innerText = category;
        cell.style.border = "1px solid #ddd";
        cell.style.padding = "8px";

        // Add event listener to the row for selection
        row.addEventListener('click', () => selectRow(row));
    });
}
