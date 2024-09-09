document.addEventListener('DOMContentLoaded', function() {
    // Call populateSystemUsers when the DOM content is loaded
    populateSystemUsers();

    // Add event listener for the save button
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', savePasswordPolicy);
    } else {
        console.error('Save button not found');
    }

    // Load existing password policy
    loadExistingPasswordPolicy();
});

// Function to populate system users
function populateSystemUsers() {
    const systemUserDropdown = document.getElementById('systemUser');
    
    if (!systemUserDropdown) {
        console.error('Element with ID "systemUser" not found');
        return;
    }

    // Fetch the user role data from localStorage
    const savedSystemUsers = localStorage.getItem('systemUsers');
    
  //  console.log('Saved system users:', savedSystemUsers);

    if (savedSystemUsers) {
        const systemUsers = JSON.parse(savedSystemUsers);
        
       // console.log('Parsed system users:', systemUsers);

        // Clear existing options
        systemUserDropdown.innerHTML = '<option value="">Select User Role</option>';
        
        systemUsers.forEach((systemUser, index) => {
           // console.log(`User role ${index}:`, systemUser);
            const option = document.createElement('option');
            option.value = systemUser.userName;
            option.textContent = systemUser.userName;
           // console.log('Adding option:', option.value, option.textContent);
            systemUserDropdown.appendChild(option);
        });
    } else {
        console.error('No system users found in localStorage');
    }
}

// Function to save password policy
function savePasswordPolicy() {
    const noOfTimesInput = document.getElementById('noOfTimes');
    const minLengthRegularsInput = document.getElementById('minLengthRegulars');
    const minLengthAdminsInput = document.getElementById('minLengthAdmins');
    //const forceChangeInput = document.getElementById('forceChange');

    if (!noOfTimesInput || !minLengthRegularsInput || !minLengthAdminsInput ) {
        console.error('One or more input elements not found');
        return;
    }

    const passwordPolicy = {
        noOfTimes: noOfTimesInput.value || '3',
        minLengthRegulars: minLengthRegularsInput.value || '8',
        minLengthAdmins: minLengthAdminsInput.value || '12',
       // forceChange: forceChangeInput.checked
    };

    localStorage.setItem('passwordPolicy', JSON.stringify(passwordPolicy));
    updateSystemUsersTable(passwordPolicy);
    //alert('Password policy saved successfully!');
}

// Function to update the systemUsers table
function updateSystemUsersTable(passwordPolicy) {
    const table = document.getElementById('systemUsers-table');
    if (!table) {
        console.error('systemUsers-table not found');
        return;
    }

    // Assuming the last row is for password policy
    let row = table.rows[table.rows.length - 1];
    if (!row || row.cells.length < 5) {
        row = table.insertRow(-1);
        for (let i = 0; i < 5; i++) {
            row.insertCell();
        }
    }

    //row.cells[0].textContent = 'Password Policy';
    row.cells[0].textContent = passwordPolicy.noOfTimes;
    row.cells[1].textContent = passwordPolicy.minLengthRegulars;
    row.cells[2].textContent = passwordPolicy.minLengthAdmins;
   // row.cells[4].textContent = passwordPolicy.forceChange ? 'Yes' : 'No';
}

// Call this function when the page loads to display any existing password policy
function loadExistingPasswordPolicy() {
    const savedPolicy = localStorage.getItem('passwordPolicy');
    if (savedPolicy) {
        const passwordPolicy = JSON.parse(savedPolicy);
        updateSystemUsersTable(passwordPolicy);
    }
}


