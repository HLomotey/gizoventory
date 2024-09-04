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
});
/*
//Highlight the selected tab
document.querySelectorAll('.header-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.header-link').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
*/