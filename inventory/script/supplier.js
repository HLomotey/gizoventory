let selectedRow = null;
let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];

document.addEventListener('DOMContentLoaded', function() {
   
    // Load existing suppliers
    updateTable();

    // Add event listener for the save button
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveChanges);
        console.log('Save button listener added');
    } else {
        console.error('Save button not found');
    }

    // Add event listener for the delete button
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteSelectedSuppliers);
        console.log('Delete button listener added');
    } else {
        console.error('Delete button not found');
    }
});

function saveSuppliers() {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    console.log('Suppliers saved:', suppliers); // Add this line for verification
}

function saveChanges() {
    

    const supplier = document.getElementById("supplier").value;
    const address = document.getElementById("address").value;
    const location = document.getElementById("location").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;

  

    if (!supplier ) {
        alert("Please fill Supplier");
        return;
    }

    if (selectedRow) {
        // Update existing supplier
        const index = selectedRow.rowIndex - 1; // Adjust for header row
        suppliers[index] = { supplier, address, location, contact, email };
        updateTableRow(selectedRow, { supplier, address, location, contact, email });
    } else {
        // Add new supplier
        suppliers.push({ supplier, address, location, contact, email });
        addTableRow({ supplier, address, location, contact, email });
    }

    // Save to localStorage
    saveSuppliers();

    // Clear the form and reset selectedRow
    clearForm();
    selectedRow = null;

    // Update the table
    updateTable();
}

function clearForm() {
    document.getElementById("supplier").value = "";
    document.getElementById("address").value = "";
    document.getElementById("location").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("email").value = "";
    document.getElementById("amend").checked = false;
}

function updateTableRow(row, data) {
    row.cells[1].textContent = data.supplier;
    row.cells[2].textContent = data.address;
    row.cells[3].textContent = data.location;
    row.cells[4].textContent = data.contact;
    row.cells[5].textContent = data.email;
}

function addTableRow(data) {
    const tableBody = document.querySelector("#suppliers-table tbody");
    const row = tableBody.insertRow();
    row.innerHTML = `
        <td><input type="checkbox" class="row-checkbox"></td>
        <td>${data.supplier}</td>
        <td>${data.address}</td>
        <td>${data.location}</td>
        <td>${data.contact}</td>
        <td>${data.email}</td>
    `;
    row.addEventListener('click', () => selectRow(row));
}

function updateTable() {
    console.log('Updating table');
    const tableBody = document.querySelector('#suppliers-table tbody');
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }
    tableBody.innerHTML = '';

    suppliers.forEach((supplier, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${supplier.supplier}</td>
            <td>${supplier.address}</td>
            <td>${supplier.location}</td>
            <td>${supplier.contact}</td>
            <td>${supplier.email}</td>
        `;
        row.addEventListener('click', (event) => {
            if (event.target.type !== 'checkbox') {
                selectRow(row);
            }
        });
        tableBody.appendChild(row);
    });
    console.log('Table updated with', suppliers.length, 'suppliers');
}

function selectRow(row) {
    if (document.getElementById("amend").checked) {
        selectedRow = row;
        document.getElementById("supplier").value = row.cells[1].innerText;
        document.getElementById("address").value = row.cells[2].innerText;
        document.getElementById("location").value = row.cells[3].innerText;
        document.getElementById("contact").value = row.cells[4].innerText;
        document.getElementById("email").value = row.cells[5].innerText;
    }
}

function filterTable() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const table = document.getElementById("suppliers-table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].innerText.toLowerCase().includes(searchInput)) {
                match = true;
                break;
            }
        }

        if (match) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function toggleAmendMode() {
    const amendMode = document.getElementById("amend").checked;
    document.getElementById("entry-number").disabled = !amendMode;
    if (!amendMode) {
        selectedRow = null;
        clearForm();
    }
}

// Add this new function to delete selected suppliers

function deleteSelectedSuppliers() {
    const checkboxes = document.querySelectorAll('#suppliers-table .row-checkbox:checked');
    if (checkboxes.length === 0) {
        showMessage('Please select at least one item to delete.');
        return;
    }

    if (confirm(`Are you sure you want to delete ${checkboxes.length} selected item(s)?`)) {
        const indicesToRemove = Array.from(checkboxes).map(checkbox => 
            parseInt(checkbox.dataset.index)
        ).sort((a, b) => b - a);

        indicesToRemove.forEach(index => {
            suppliers.splice(index, 1);
        });

        saveSuppliers();
        updateTable();
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

// Add this function to get selected suppliers
function getSelectedSuppliers() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => suppliers[parseInt(checkbox.dataset.index)]);
}

// Call this function after any checkbox state change
document.addEventListener('change', function(e) {
    if (e.target.matches('.row-checkbox') || e.target.matches('#selectAll')) {
        updateDeleteButtonState();
    }
});

/*
function updateDeleteButtonState() {
    const deleteButton = document.getElementById('deleteButton');
    const selectedSuppliers = getSelectedSuppliers();
    deleteButton.disabled = selectedSuppliers.length === 0;
}
    */

// Also call it when the page loads
document.addEventListener('DOMContentLoaded', updateDeleteButtonState);

function updateDeleteButtonState() {
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        const selectedSuppliers = getSelectedSuppliers();
        deleteButton.disabled = selectedSuppliers.length === 0;
    } else {
        console.error('Delete button not found');
    }
}
