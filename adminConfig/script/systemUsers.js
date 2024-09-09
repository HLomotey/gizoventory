// stockIssue.js
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

document.getElementById('system-user-form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveChanges();
});

function initializePage() {
   // setInitialUserRoles();
    populateUserRole();
    loadSystemUsers();
    
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
let systemUsers = [];
let isAmendMode = false;
let selectedSystemUserIndex = -1;

// Function to toggle amend mode
function toggleAmendMode() {
    isAmendMode = document.getElementById('amend').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
        const fields = ['userName', 'userRole', 'email', 'passwordExpiryInMonth','idletime'];
    fields.forEach(field => document.getElementById(field).value = '');
    document.getElementById('amend').checked = false;
    isAmendMode = false;
    selectedSystemUserIndex = -1;
}

// Function to update the table with current stock issues
function updateTable() {
    const tableBody = document.querySelector('#system-user-table tbody');
    tableBody.innerHTML = '';

        systemUsers.forEach((user, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
            <td>${user.userName}</td>
            <td>${user.userRole}</td>
            <td>${user.email}</td>
            <td>${user.passwordExpiryInMonth || '5'}</td>     
            <td>${user.idletime || '5'}</td>         
        `;
        row.addEventListener('click', () => selectSystemUser(index));
    });
}

// Function to select a stock issue for editing
function selectSystemUser(index) {
    const user = systemUsers[index];
    const fields = ['userName', 'userRole', 'email', 'passwordExpiryInMonth','idletime'];
    fields.forEach(field => document.getElementById(field).value = user[field]);
    document.getElementById('amend').checked = true;
    isAmendMode = true;
    selectedSystemUserIndex = index;
}

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
        const tableRows = document.querySelectorAll('#system-user-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}

// Function to populate user roles
function populateUserRole() {
    const userRoleDropdown = document.getElementById('userRole');
    
    // Fetch the user role data from localStorage
    const savedUserRoles = localStorage.getItem('userRoles');
    
    console.log('Saved user roles:', savedUserRoles);

    if (savedUserRoles) {
        const userRoles = JSON.parse(savedUserRoles);
        
        console.log('Parsed user roles:', userRoles);

        // Clear existing options
        userRoleDropdown.innerHTML = '<option value="">Select User Role</option>';
        
        userRoles.forEach((userRole, index) => {
            console.log(`User role ${index}:`, userRole);
            const option = document.createElement('option');
            option.value = userRole.userRole;
            option.textContent = userRole.userRole;
            console.log('Adding option:', option.value, option.textContent);
            userRoleDropdown.appendChild(option);
        });
    } else {
        console.error('No user roles found in localStorage');
    }
}

// Add this function to load stock issues
function loadSystemUsers() {
    const savedSystemUsers = localStorage.getItem('systemUsers');
    if (savedSystemUsers) {
        systemUsers = JSON.parse(savedSystemUsers);
        updateTable();
    }
}

// Function to save changes
function saveChanges() {
    const userName = document.getElementById('userName').value;
    const userRole = document.getElementById('userRole').value;   
    const email = document.getElementById('email').value;
    let passwordExpiryInMonth = document.getElementById('passwordExpiryInMonth').value;
    let idletime = document.getElementById('idletime').value;

    // Set default values if null or empty
    passwordExpiryInMonth = passwordExpiryInMonth || '5';
    idletime = idletime || '5';

    const newSystemUser = {
        userName,
        userRole,
        email,
        passwordExpiryInMonth,
        idletime
    };

    if (isAmendMode && selectedSystemUserIndex !== -1) {
        systemUsers[selectedSystemUserIndex] = newSystemUser;
    } else {
        systemUsers.push(newSystemUser);
    }

    localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
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
        systemUsers.splice(index, 1);
    });

    localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    updateTable();
}
/*
function setInitialUserRoles() {
    const initialUserRoles = [
        { name: 'Admin' },
        { name: 'User' },
        { name: 'Manager' }
    ];
    if (!localStorage.getItem('userRoles')) {
        localStorage.setItem('userRoles', JSON.stringify(initialUserRoles));
    }
}
    */
