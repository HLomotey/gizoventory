function addClickListener(elements, groupClass) {
    elements.forEach(element => {
        element.addEventListener('click', () => {
            // Remove 'active' class from all elements in the same group
            document.querySelectorAll(`.${groupClass} a`).forEach(elem => {
                elem.classList.remove('active');
            });

            // Add 'active' class to the clicked element
            element.classList.add('active');
        });
    });
}

// Apply the click listener to each group separately
addClickListener(document.querySelectorAll('.navbar a'), 'navbar');
addClickListener(document.querySelectorAll('.tabs a'), 'tabs');
addClickListener(document.querySelectorAll('.header a'), 'header');

function saveAuditTrail(actionTaken) {
    const currentDateTime = new Date().toISOString();
    const systemUser = getCurrentUser(); // You'll need to implement this function
    const computerName = getComputerName(); // You'll need to implement this function

    // Assuming you have a function to save data to the auditTrail table
    saveToAuditTrailTable(currentDateTime, systemUser, actionTaken, computerName);
}

function getCurrentUser() {
    // Implement logic to get the current user
    // This might involve checking a global variable, session storage, or making an API call
    // For example:
    // return sessionStorage.getItem('currentUser');
}

function getComputerName() {
    // Implement logic to get the computer name
    // This might not be easily available in a browser environment
    // You might need to rely on server-side information or use a different approach
    // For example:
    // return window.navigator.userAgent;
}

function saveToAuditTrailTable(dateTime, user, action, computer) {
    // Get existing audit trail data
    let auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    
    // Add new entry
    auditTrail.push({ dateTime, user, action, computer });
    
    // Save back to localStorage
    localStorage.setItem('auditTrail', JSON.stringify(auditTrail));
}

function getAuditTrail() {
    return JSON.parse(localStorage.getItem('auditTrail') || '[]');
}

function displayAuditTrail() {
    const auditTrail = getAuditTrail();
    const auditTrailTable = document.getElementById('auditTrailTable');
    
    // Clear existing table content
    auditTrailTable.innerHTML = '';
    
    // Create table header
    const header = auditTrailTable.createTHead();
    const headerRow = header.insertRow(0);
    ['Date/Time', 'User', 'Action', 'Computer'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    
    // Populate table with audit trail data
    const tbody = auditTrailTable.createTBody();
    auditTrail.forEach(entry => {
        const row = tbody.insertRow();
        ['dateTime', 'user', 'action', 'computer'].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = entry[key];
        });
    });
}

// Call this when the app launches
document.addEventListener('DOMContentLoaded', () => {
    displayAuditTrail();
});

// Call this whenever you want to update the display
// For example, after saving a new audit trail entry
function updateAuditTrailDisplay() {
    displayAuditTrail();
}

// Modify saveAuditTrail to update the display
function saveAuditTrail(actionTaken) {
    const currentDateTime = new Date().toISOString();
    const systemUser = getCurrentUser();
    const computerName = getComputerName();

    saveToAuditTrailTable(currentDateTime, systemUser, actionTaken, computerName);
    updateAuditTrailDisplay(); // Update the display after saving
}

// Example usage:
// Add this to your click event listeners or any other relevant actions
// saveAuditTrail('Clicked navbar item');
