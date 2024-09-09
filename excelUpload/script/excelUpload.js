document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[name="data-type"]');
    const selectedDataTypeElement = document.getElementById('selectedDataType');
    const uploadButton = document.getElementById('uploadButton');
    const excelTable = document.getElementById('excelUpload-table');
    let selectedSheetName = '';

    function clearTable() {
        const tbody = excelTable.querySelector('tbody');
        const thead = excelTable.querySelector('thead tr');
        tbody.innerHTML = '';
        thead.innerHTML = '<th class="select-all-header"><input type="checkbox" id="selectAll" checked></th>';
        selectedDataTypeElement.textContent = '';
    }

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                clearTable(); // Clear table when a new data type is selected
                selectedDataTypeElement.textContent = 'Uploading Data for ' + this.value;
                selectedSheetName = this.dataset.sheet;
            }
        });
    });

    uploadButton.addEventListener('click', function() {
        if (!selectedSheetName) {
            alert('Please select a data type before uploading.');
            return;
        }

        clearTable(); // Clear table before uploading new data

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                
                if (!workbook.SheetNames.includes(selectedSheetName)) {
                    alert(`Sheet "${selectedSheetName}" not found in the uploaded Excel file.`);
                    return;
                }
                
                const worksheet = workbook.Sheets[selectedSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                
                renderTable(jsonData);
            };
            
            reader.readAsArrayBuffer(file);
        };
        
        input.click();
    });

    function renderTable(data) {
        const headers = data[0];
        const tbody = excelTable.querySelector('tbody');
        const thead = excelTable.querySelector('thead tr');
        
        // Clear existing table content
        tbody.innerHTML = '';
        thead.innerHTML = '<th class="select-all-header"><input type="checkbox" id="selectAll" checked></th>';
        
        // Add headers
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            thead.appendChild(th);
        });
        
        // Add data rows
        for (let i = 1; i < data.length; i++) {
            const row = tbody.insertRow();
            const checkboxCell = row.insertCell();
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkboxCell.appendChild(checkbox);
            
            data[i].forEach((cell, index) => {
                const td = row.insertCell();
                td.textContent = formatCellValue(cell, headers[index]);
            });
        }

        // Add event listener for "Select All" checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    function formatCellValue(value, header) {
        // Check if the value is a date (Excel stores dates as numbers)
        if (typeof value === 'number' && !isNaN(value) && header.toLowerCase().includes('date')) {
            // Convert Excel date serial number to JavaScript Date object
            const date = new Date((value - 25569) * 86400 * 1000);
            // Format the date as YYYY-MM-DD
            return date.toISOString().split('T')[0];
        }
        return value;
    }
});

// Function to filter the table based on search input
function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#excelUpload-table tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchInput) ? '' : 'none';
    });
}
