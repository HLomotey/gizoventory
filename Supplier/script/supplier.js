let selectedRow = null;

function addSupplier() {
    const supplier = document.getElementById("supplier").value;
    const address = document.getElementById("address").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;

    const tableBody = document.querySelector("#suppliers-table tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${supplier}</td>
        <td>${address}</td>
        <td>${contact}</td>
        <td>${email}</td>
    `;
    row.onclick = () => selectRow(row);
    tableBody.appendChild(row);

    // Clear the input fields
    document.getElementById("supplier").value = "";
    document.getElementById("address").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("email").value = "";
}

function saveChanges() {
    if (document.getElementById("amend").checked && selectedRow) {
        selectedRow.cells[0].innerText = document.getElementById("supplier").value;
        selectedRow.cells[1].innerText = document.getElementById("address").value;
        selectedRow.cells[2].innerText = document.getElementById("contact").value;
        selectedRow.cells[3].innerText = document.getElementById("email").value;
    } else {
        addSupplier();
    }

    // Clear the input fields
    document.getElementById("supplier").value = "";
    document.getElementById("address").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("email").value = "";
    selectedRow = null;
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
        document.getElementById("supplier").value = "";
        document.getElementById("address").value = "";
        document.getElementById("contact").value = "";
        document.getElementById("email").value = "";
    }
}

function selectRow(row) {
    if (document.getElementById("amend").checked) {
        selectedRow = row;
        document.getElementById("supplier").value = row.cells[0].innerText;
        document.getElementById("address").value = row.cells[1].innerText;
        document.getElementById("contact").value = row.cells[2].innerText;
        document.getElementById("email").value = row.cells[3].innerText;
    }
}

function navigate(page) {
    switch(page) {
        case 'ProductCategory':
            window.location.href = './ProductCategory.html';
            break;
        case 'ProductRegistration':
            window.location.href = './ProductRegistration.html';
            break;
        case 'Suppliers':
            window.location.href = './Suppliers.html';
            break;
        case 'Department':
            window.location.href = './Department.html';
            break;
    }
}