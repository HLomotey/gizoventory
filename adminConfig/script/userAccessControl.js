document.addEventListener('DOMContentLoaded', function() {
    const checkboxList = document.getElementById('checkboxList');
    const selectAllCheckbox = document.getElementById('selectAll');

    const userRights = [
        "Update Bonus PayRun",
        "Update Bonus Tax Schedule",
        "Update Custom Allowance/Deduction/Tax Reliefs",
        "Update Custom Employee Teir3 Contribution",
        "Update Custom Employer Teir3 Contribution",
        "Update Exceptions PayRun",
        "Update Forex Rate Details",
        "Update GRA Tax Schedule",
        "Update Guaranteed Net Salaries",
        "Update Institution Details",
        "Update Management Level Details",
        "Update Monthly PayRun",
        "Update Other Statutory Tax Schedule",
        "Update OverTime Tax Schedule",
        "Update Paying Bank Details",
        "Update ProRate PayRun",
        "Update Staff BackPay Details",
        "Update Staff Bonus Details",
        "Update Staff Freeze Details",
        "Update Staff Loan Details",
        "Update Staff Multiple Bank Details",
        "Update Staff Overtime Allowance Details",
        "Update Staff Payroll Details",
        "Update Staff Registration Details",
        "Update Temporary Workers List",
        "Update Tier1 and 2 Exemptions",
        "Update Unregistered Provident Fund",
        "View Dashboard Reports",
        "View GRA Monthly Tax Deduction Reports"
    ];

    // Generate checkboxes
    userRights.forEach((right, index) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `right_${index}`;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${right}`));
        
        if (right === "View Dashboard Reports") {
            label.classList.add('highlight');
        }
        
        checkboxList.appendChild(label);
    });

    // Select All functionality
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = checkboxList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

       // Call populateUserRole when the DOM content is loaded
       populateUserRole();
});

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
