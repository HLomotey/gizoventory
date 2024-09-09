let selectedRow = null;

function loadDepartments() {
    const departments = JSON.parse(localStorage.getItem('departments') || '[]');
    const tableBody = document.querySelector('#departmentTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    departments.forEach(department => {
        const row = document.createElement('tr');
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('rowCheckbox');
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        const departmentCell = document.createElement('td');
        departmentCell.textContent = department.name;
        row.appendChild(departmentCell);

        tableBody.appendChild(row);
    });

    updateSelectAllCheckbox();
}

function addDepartment(departmentName) {
    const departments = JSON.parse(localStorage.getItem('departments') || '[]');
    departments.push({ name: departmentName });
    localStorage.setItem('departments', JSON.stringify(departments));
    loadDepartments();
}

function saveChanges() {
    const departmentName = document.getElementById('departmentInput').value.trim();
    if (departmentName === '') return;

    if (document.getElementById("amend").checked && selectedRow) {
        const departments = JSON.parse(localStorage.getItem('departments') || '[]');
        const index = Array.from(selectedRow.parentNode.children).indexOf(selectedRow) - 1;
        departments[index] = { name: departmentName };
        localStorage.setItem('departments', JSON.stringify(departments));
    } else {
        addDepartment(departmentName);
    }

    document.getElementById('departmentInput').value = "";
    selectedRow = null;
    loadDepartments();
}

function filterTable() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const rows = document.querySelectorAll('#departmentTable tbody tr');

    rows.forEach(row => {
        const departmentName = row.cells[1].textContent.toLowerCase();
        row.style.display = departmentName.includes(searchInput) ? "" : "none";
    });
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
        document.getElementById('departmentInput').value = row.cells[1].textContent;
    }
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    selectAllCheckbox.checked = checkboxes.length > 0 && Array.from(checkboxes).every(checkbox => checkbox.checked);
}

function toggleAllCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

function deleteSelectedItems() {
    const checkboxes = document.querySelectorAll('#departmentTable .rowCheckbox:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one item to delete.');
        return;
    }

    if (confirm('Are you sure you want to delete the selected departments?')) {
        const departments = JSON.parse(localStorage.getItem('departments') || '[]');
        const indicesToRemove = Array.from(checkboxes).map(checkbox => 
            Array.from(checkbox.closest('tr').parentNode.children).indexOf(checkbox.closest('tr'))
        ).sort((a, b) => b - a);

        indicesToRemove.forEach(index => {
            departments.splice(index, 1);
        });

        localStorage.setItem('departments', JSON.stringify(departments));
        loadDepartments();
    }
}

function confirmDelete() {
    const checkboxes = document.querySelectorAll('#departmentTable .rowCheckbox:checked');
    const departments = JSON.parse(localStorage.getItem('departments') || '[]');
    const indicesToRemove = Array.from(checkboxes).map(checkbox => 
        Array.from(checkbox.closest('tr').parentNode.children).indexOf(checkbox.closest('tr'))
    ).sort((a, b) => b - a);

    indicesToRemove.forEach(index => {
        departments.splice(index, 1);
    });

    localStorage.setItem('departments', JSON.stringify(departments));
    loadDepartments();
    hideDeleteModal();
}

/*
function showDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
}

function hideDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
}
    */

// Call loadDepartments when the page loads
window.onload = function() {
    loadDepartments();
    
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.addEventListener('change', toggleAllCheckboxes);
};

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveButton').addEventListener('click', saveChanges);
    document.getElementById('amend').addEventListener('change', toggleAmendMode);
    document.getElementById('search-input').addEventListener('input', filterTable);
    
    document.querySelector('#departmentTable tbody').addEventListener('click', function(e) {
        if (e.target.tagName === 'TD') {
            selectRow(e.target.parentElement);
        }
    });

    document.querySelector('#departmentTable tbody').addEventListener('change', function(e) {
        if (e.target.classList.contains('rowCheckbox')) {
            updateSelectAllCheckbox();
        }
    });

    // Update this line to use the correct function name
    document.getElementById('deleteButton').addEventListener('click', deleteSelectedItems);
});

// In your department registration script
function saveDepartment(department) {
    let departments = JSON.parse(localStorage.getItem('departments')) || [];
    departments.push(department);
    localStorage.setItem('departments', JSON.stringify(departments));
}

