document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

function initializePage() {
    // Load system users from local storage (if needed)
    systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');

    populateUserRoles();
    observeUserRolesTable();
    updateTable();
}

document.querySelector('.save-button').addEventListener('click', (event) => {
    event.preventDefault();
    saveChanges();
});

// Global variables
let systemUsers = [];
let isAmendMode = false;
let selectedUserIndex = -1;

// Function to toggle amend mode
function toggleAmendMode() {
    isAmendMode = document.getElementById('amend-user').checked;
    if (!isAmendMode) {
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
    const fields = ['username', 'userrole', 'email', 'password-expiry', 'expiry-date', 'idletime'];
    fields.forEach(field => document.getElementById(field).value = '');
    document.getElementById('amend-user').checked = false;
    document.getElementById('specify-date').checked = false;
    document.getElementById('enforce-password').checked = false;
    isAmendMode = false;
    selectedUserIndex = -1;
}

// Function to update the table with current system users
function updateTable() {
    const tableBody = document.querySelector('#systemUsers-table tbody');
    tableBody.innerHTML = '';

    systemUsers.forEach((user, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.userrole}</td>
            <td>${user.expiryDate || 'N/A'}</td>
            <td>${user.email}</td>
        `;
        row.addEventListener('click', () => selectUser(index));
    });
}

// Function to select a user for editing
function selectUser(index) {
    const user = systemUsers[index];
    document.getElementById('username').value = user.username;
    document.getElementById('userrole').value = user.userrole;
    document.getElementById('email').value = user.email;
    document.getElementById('password-expiry').value = user.passwordExpiry;
    document.getElementById('expiry-date').value = user.expiryDate;
    document.getElementById('idletime').value = user.idleTime;
    document.getElementById('amend-user').checked = true;
    document.getElementById('specify-date').checked = user.specifyDate;
    document.getElementById('enforce-password').checked = user.enforcePassword;
    isAmendMode = true;
    selectedUserIndex = index;
}

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#systemUsers-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}

// Function to populate user roles
function populateUserRoles() {
    const select = document.getElementById('userrole');
    select.innerHTML = ''; // Clear existing options

    // Get user roles from localStorage
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');

    userRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.roleName; 
        option.textContent = role.roleName;
        select.appendChild(option);
    });

    if (userRoles.length === 0) {
        console.warn('No user roles found in localStorage.');
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'No roles available';
        select.appendChild(defaultOption);
    }
}

// Function to observe changes in the user roles table
function observeUserRolesTable() {
    const userRolesTable = document.getElementById('userRoleTable');
    if (!userRolesTable) {
        console.warn('User roles table not found. This is expected on the System Users page.');
        return;
    }

    const observer = new MutationObserver(() => {
        populateUserRoles();
    });

    observer.observe(userRolesTable, { childList: true, subtree: true });
}

// Function to save changes (new user or update existing user)
function saveChanges() {
    const user = {
        username: document.getElementById('username').value,
        userrole: document.getElementById('userrole').value,
        email: document.getElementById('email').value,
        passwordExpiry: document.getElementById('password-expiry').value,
        expiryDate: document.getElementById('expiry-date').value,
        idleTime: document.getElementById('idletime').value,
        specifyDate: document.getElementById('specify-date').checked,
        enforcePassword: document.getElementById('enforce-password').checked
    };

    if (!user.username || !user.userrole) {
        alert('Please fill in at least the username and user role.');
        return;
    }

    if (isAmendMode && selectedUserIndex !== -1) {
        systemUsers[selectedUserIndex] = user;
    } else {
        systemUsers.push(user);
    }

    localStorage.setItem('systemUsers', JSON.stringify(systemUsers));

    updateTable();
    clearForm();
}

// Call initializePage when the page loads
window.addEventListener('DOMContentLoaded', initializePage);
window.addEventListener('focus', initializePage);

// Add this temporarily to test user role population
localStorage.setItem('userRoles', JSON.stringify([
    { roleName: 'Admin' },
    { roleName: 'User' },
    { roleName: 'Manager' }
]));
