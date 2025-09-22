/* --- Admin Dashboard Script --- */

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    
    // Event listeners
    document.getElementById('search-btn').addEventListener('click', searchRecords);
    document.getElementById('show-all-btn').addEventListener('click', loadDashboard);
    document.getElementById('print-all-btn').addEventListener('click', printAllRecords);
    document.querySelector('.modal .close-btn').addEventListener('click', () => {
        document.getElementById('record-modal').style.display = 'none';
        document.getElementById('print-modal').style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

async function loadDashboard() {
    await fetchStats();
    await fetchRecords();
}

async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}?action=getCounts&countType=total`);
        const stats = await response.json();
        const statsDiv = document.getElementById('dashboard-stats');
        statsDiv.innerHTML = `
            <div class="stat-box">
                <h4>Total Households</h4>
                <p>${stats.totalHouseholds}</p>
            </div>
            <div class="stat-box">
                <h4>Total Members</h4>
                <p>${stats.totalMembers}</p>
            </div>
            <div class="stat-box">
                <h4>Total Children</h4>
                <p>${stats.totalChildren}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

async function fetchRecords() {
    try {
        const response = await fetch(`${API_URL}?action=getRecords`);
        const records = await response.json();
        displayRecords(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        alert('Failed to load records. Please check the API URL and deployment.');
    }
}

async function searchRecords() {
    const query = document.getElementById('search-input').value.trim();
    if (query.length === 0) {
        alert('Please enter a search query.');
        return;
    }
    try {
        const response = await fetch(`${API_URL}?action=searchRecords&query=${encodeURIComponent(query)}`);
        const records = await response.json();
        displayRecords(records);
    } catch (error) {
        console.error('Error searching records:', error);
        alert('Search failed. Please try again.');
    }
}

function displayRecords(records) {
    const tableBody = document.querySelector('#records-table tbody');
    tableBody.innerHTML = '';
    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No records found.</td></tr>';
        return;
    }
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.BlockName}</td>
            <td>${record.ResidentialAddress}</td>
            <td>${record.ContactNo}</td>
            <td class="action-buttons">
                <button class="view-btn" data-household-id="${record.HouseholdID}">View</button>
                <button class="edit-btn" data-household-id="${record.HouseholdID}">Edit</button>
                <button class="delete-btn" data-household-id="${record.HouseholdID}">Delete</button>
                <button class="print-btn" data-household-id="${record.HouseholdID}">Print</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', viewRecord));
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', editRecord));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', deleteRecord));
    document.querySelectorAll('.print-btn').forEach(btn => btn.addEventListener('click', printRecord));
}

async function viewRecord(e) {
    const householdID = e.target.dataset.householdId;
    try {
        const response = await fetch(`${API_URL}?action=getRecordDetails&householdID=${householdID}`);
        const record = await response.json();
        displayRecordDetails(record, false);
    } catch (error) {
        console.error('Error fetching record details:', error);
        alert('Failed to load record details.');
    }
}

async function editRecord(e) {
    const householdID = e.target.dataset.householdId;
    try {
        const response = await fetch(`${API_URL}?action=getRecordDetails&householdID=${householdID}`);
        const record = await response.json();
        displayRecordDetails(record, true);
    } catch (error) {
        console.error('Error fetching record details:', error);
        alert('Failed to load record details for editing.');
    }
}

async function deleteRecord(e) {
    const householdID = e.target.dataset.householdId;
    if (confirm('Are you sure you want to delete this record and all associated members and children?')) {
        try {
            const response = await fetch(`${API_URL}?action=deleteRecord&householdID=${householdID}`, {
                method: 'POST'
            });
            if (response.ok) {
                alert('Record deleted successfully.');
                loadDashboard(); // Reload the dashboard
            } else {
                alert('Failed to delete record.');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('An error occurred during deletion.');
        }
    }
}

async function printRecord(e) {
    const householdID = e.target.dataset.householdId;
    try {
        const response = await fetch(`${API_URL}?action=getRecordToPrint&householdID=${householdID}`);
        const record = await response.json();
        
        const printContent = document.getElementById('print-content');
        printContent.innerHTML = generatePrintableContent(record);
        
        document.getElementById('print-modal').style.display = 'block';

    } catch (error) {
        console.error('Error preparing record for print:', error);
        alert('Failed to prepare record for printing.');
    }
}

async function printAllRecords() {
    try {
        const response = await fetch(`${API_URL}?action=getRecords`);
        const householdRecords = await response.json();

        let printContentHtml = '';

        for (const record of householdRecords) {
            const detailsResponse = await fetch(`${API_URL}?action=getRecordToPrint&householdID=${record.HouseholdID}`);
            const fullRecord = await detailsResponse.json();
            printContentHtml += `<div class="record-to-print">${generatePrintableContent(fullRecord)}</div><hr style="page-break-after: always;">`;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>All Census Records</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .record-to-print h3 { color: #1a73e8; }
                    .record-to-print hr { border: none; border-top: 1px dashed #ccc; margin: 20px 0; }
                    @media print {
                        .record-to-print { page-break-inside: avoid; }
                        hr { display: none; }
                    }
                </style>
            </head>
            <body>${printContentHtml}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } catch (error) {
        console.error('Error printing all records:', error);
        alert('Failed to print all records.');
    }
}


function displayRecordDetails(record, isEdit) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';
    
    const form = document.createElement('form');
    form.id = 'edit-form';
    form.dataset.householdId = record.household.HouseholdID;
    
    // Household Section
    const householdSection = document.createElement('div');
    householdSection.className = 'section';
    householdSection.innerHTML = `
        <h3>Household Information</h3>
        <label>Block Name:</label>
        <input type="text" name="blockName" value="${record.household.BlockName || ''}" ${!isEdit ? 'readonly' : ''}>
        <label>Residential Address:</label>
        <input type="text" name="residentialAddress" value="${record.household.ResidentialAddress || ''}" ${!isEdit ? 'readonly' : ''}>
        <label>Contact Number:</label>
        <input type="tel" name="contactNo" value="${record.household.ContactNo || ''}" ${!isEdit ? 'readonly' : ''}>
    `;
    form.appendChild(householdSection);

    // Members Section
    const membersSection = document.createElement('div');
    membersSection.className = 'section';
    membersSection.innerHTML = '<h3>Members Information</h3><div id="members-container"></div>';
    form.appendChild(membersSection);
    record.members.forEach(member => {
        membersSection.querySelector('#members-container').insertAdjacentHTML('beforeend', createMemberForm(member));
    });
    if (isEdit) {
        const addMemberBtn = document.createElement('button');
        addMemberBtn.type = 'button';
        addMemberBtn.textContent = '➕ Add Another Member';
        addMemberBtn.className = 'add-button';
        addMemberBtn.onclick = () => membersSection.querySelector('#members-container').insertAdjacentHTML('beforeend', createMemberForm());
        membersSection.appendChild(addMemberBtn);
    }

    // Children Section
    const childrenSection = document.createElement('div');
    childrenSection.className = 'section';
    childrenSection.innerHTML = '<h3>Children Information</h3><div id="children-container"></div>';
    form.appendChild(childrenSection);
    record.children.forEach(child => {
        childrenSection.querySelector('#children-container').insertAdjacentHTML('beforeend', createChildForm(child));
    });
    if (isEdit) {
        const addChildBtn = document.createElement('button');
        addChildBtn.type = 'button';
        addChildBtn.textContent = '➕ Add Another Child';
        addChildBtn.className = 'add-button';
        addChildBtn.onclick = () => childrenSection.querySelector('#children-container').insertAdjacentHTML('beforeend', createChildForm());
        childrenSection.appendChild(addChildBtn);
    }
    
    if (isEdit) {
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Save Changes';
        submitBtn.className = 'submit-button';
        form.appendChild(submitBtn);
    }

    modalBody.appendChild(form);
    
    if (isEdit) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = collectFormData();
            data.household.householdID = form.dataset.householdId;
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            try {
                const response = await fetch(`${API_URL}?action=updateRecord`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    alert('Record updated successfully.');
                    document.getElementById('record-modal').style.display = 'none';
                    loadDashboard();
                } else {
                    alert('Update failed. Please try again.');
                }
            } catch (error) {
                console.error('Error updating record:', error);
                alert('An error occurred. Please check the console.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            }
        });
    }

    document.getElementById('record-modal').style.display = 'block';
}

function generatePrintableContent(record) {
    let html = `
        <div class="print-header" style="text-align: center;">
            <img src="https://i.ibb.co/6y45s1x/our-lady-of-fatima-shrine.jpg" style="width: 80px; height: 80px;">
            <h2>Our Lady of Fatima Shrine Census Record</h2>
            <p>1989 Phillip Mpiwa Str., P.O. Box 8005, Galeshewe, KIMBERLEY, 8301<br>Email: fatimashrinekby@gmail.com</p>
            <hr>
        </div>
        
        <h3>Household Information</h3>
        <p><strong>Block Name:</strong> ${record.household.BlockName || 'N/A'}</p>
        <p><strong>Residential Address:</strong> ${record.household.ResidentialAddress || 'N/A'}</p>
        <p><strong>Contact No:</strong> ${record.household.ContactNo || 'N/A'}</p>
        
        <h3>Members</h3>
        <hr>
    `;
    
    if (record.members && record.members.length > 0) {
        record.members.forEach(member => {
            html += `
                <div class="member-details">
                    <p><strong>Name:</strong> ${member.FirstName} ${member.LastName}</p>
                    <p><strong>Date of Birth:</strong> ${member.DateOfBirth || 'N/A'}</p>
                    <p><strong>Catholic:</strong> ${member.Catholic || 'N/A'}</p>
                    <p><strong>Occupation:</strong> ${member.Occupation || 'N/A'}</p>
                    <p><strong>Church Activities:</strong> ${member.ChurchActivities || 'N/A'}</p>
                    <p><strong>Solidarity/Ministry:</strong> ${member.SolidarityMinistry || 'N/A'}</p>
                    <p><strong>Leadership:</strong> ${member.Leadership || 'N/A'}</p>
                    <h4>Sacraments</h4>
                    <p><strong>Baptism:</strong> ${member.Baptised || 'No'}</p>
                    ${member.Baptised === 'Yes' ? `<p> - Date: ${member.DateOfBaptism || 'N/A'}<br> - Reg. No: ${member.BaptismRegistrationNo || 'N/A'}<br> - Church: ${member.BaptismChurch || 'N/A'}<br> - Location: ${member.BaptismLocation || 'N/A'}</p>` : ''}
                    <p><strong>1st Communion:</strong> ${member.FirstCommunion || 'No'}</p>
                    ${member.FirstCommunion === 'Yes' ? `<p> - Date: ${member.DateFirstCommunion || 'N/A'}<br> - Church: ${member.FirstCommunionChurch || 'N/A'}</p>` : ''}
                    <p><strong>Confirmation:</strong> ${member.Confirmation || 'No'}</p>
                    ${member.Confirmation === 'Yes' ? `<p> - Date: ${member.DateOfConfirmation || 'N/A'}<br> - Church: ${member.ConfirmationChurch || 'N/A'}</p>` : ''}
                    <h4>Marital Status</h4>
                    <p><strong>Status:</strong> ${member.MaritalStatus || 'N/A'}</p>
                    <p><strong>Civil Marriage Date:</strong> ${member.CivilCourtMarriageDate || 'N/A'}</p>
                    <p><strong>Church Marriage Date:</strong> ${member.ChurchMarriageDate || 'N/A'}</p>
                    <p><strong>Church Marriage Place:</strong> ${member.ChurchMarriagePlace || 'N/A'}</p>
                    <p><strong>Divorced:</strong> ${member.Divorced || 'N/A'}</p>
                    <h4>Dikabelo</h4>
                    <p><strong>Dikabelo:</strong> ${member.Dikabelo || 'No'}</p>
                    ${member.Dikabelo === 'Yes' ? `<p> - Last Dikabelo Date: ${member.DateLastDikabelo || 'N/A'}</p>` : ''}
                </div>
                <hr>
            `;
        });
    } else {
        html += '<p>No members listed.</p><hr>';
    }

    html += '<h3>Children</h3><hr>';
    if (record.children && record.children.length > 0) {
        record.children.forEach(child => {
            html += `
                <div class="child-details">
                    <p><strong>Name:</strong> ${child.FirstName} ${child.LastName}</p>
                    <p><strong>Date of Birth:</strong> ${child.DateOfBirth || 'N/A'}</p>
                    <p><strong>Age:</strong> ${child.Age || 'N/A'}</p>
                    <p><strong>Catholic:</strong> ${child.Catholic || 'N/A'}</p>
                    <p><strong>Church Activities:</strong> ${child.ChurchActivities || 'N/A'}</p>
                    <h4>Sacraments</h4>
                    <p><strong>Baptism:</strong> ${child.Baptised || 'No'}</p>
                    ${child.Baptised === 'Yes' ? `<p> - Date: ${child.DateOfBaptism || 'N/A'}<br> - Reg. No: ${child.BaptismRegistrationNo || 'N/A'}<br> - Church: ${child.BaptismChurch || 'N/A'}<br> - Location: ${child.BaptismLocation || 'N/A'}</p>` : ''}
                    <p><strong>1st Communion:</strong> ${child.FirstCommunion || 'No'}</p>
                    ${child.FirstCommunion === 'Yes' ? `<p> - Date: ${child.DateFirstCommunion || 'N/A'}<br> - Church: ${child.FirstCommunionChurch || 'N/A'}</p>` : ''}
                    <p><strong>Confirmation:</strong> ${child.Confirmation || 'No'}</p>
                    ${child.Confirmation === 'Yes' ? `<p> - Date: ${child.DateOfConfirmation || 'N/A'}<br> - Church: ${child.ConfirmationChurch || 'N/A'}</p>` : ''}
                </div>
                <hr>
            `;
        });
    } else {
        html += '<p>No children listed.</p><hr>';
    }
    
    return html;
}
