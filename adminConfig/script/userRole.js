// stockIssue.js
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

document.getElementById('user-role-form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveChanges();
});

function initializePage() {
   
    loadUserRoles();
    
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
let userRoles = [];
let isAmendMode = false;
let selectedUserRoleIndex = -1;

// Function to toggle amend mode
function toggleAmendMode() {
    isAmendMode = document.getElementById('amend').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
    const fields = ['userRole'];
    fields.forEach(field => document.getElementById(field).value = '');
    document.getElementById('amend').checked = false;
    isAmendMode = false;
    selectedUserRoleIndex = -1;
}

// Function to update the table with current stock issues
function updateTable() {
    const tableBody = document.querySelector('#userRole-table tbody');
    tableBody.innerHTML = '';

    userRoles.forEach((issue, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${issue.userRole}</td>
                
        `;
        row.addEventListener('click', () => selectUserRole(index));
    });
}

// Function to select a stock issue for editing
function selectUserRole(index) {
    const issue = userRoles[index];
    const fields = ['userRole'];
    fields.forEach(field => document.getElementById(field).value = issue[field]);
    document.getElementById('amend').checked = true;
    isAmendMode = true;
    selectedUserRoleIndex = index;
}

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#userRole-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}


// Add this function to load stock issues
function loadUserRoles() {
    const savedUserRoles = localStorage.getItem('userRoles');
    if (savedUserRoles) {
        userRoles = JSON.parse(savedUserRoles);
        updateTable();
    }
}

// Function to save changes
function saveChanges() {
    const userRole = document.getElementById('userRole').value;

    if (!userRole) {
        alert('Please fill in User Role field');
        return;
    }

    const newUserRole = {
        userRole: userRole // Changed from 'name' to 'userRole'
    };

    if (isAmendMode && selectedUserRoleIndex !== -1) {
        userRoles[selectedUserRoleIndex] = newUserRole;
    } else {
        userRoles.push(newUserRole);
    }

    localStorage.setItem('userRoles', JSON.stringify(userRoles));
    updateTable();
    clearForm();
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
        userRoles.splice(index, 1);
    });

    localStorage.setItem('userRoles', JSON.stringify(userRoles));
    updateTable();
}
