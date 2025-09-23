const API_URL = 'https://script.google.com/macros/s/AKfycbwpsMpkLyGNh8ACiAxHuUfNDwd0QgjWI6BKKoPzHtIvrAcwpUTgUkB7FUcjvHyM2Lyu/exec';

document.addEventListener('DOMContentLoaded', () => {
    fetchCounts();
    fetchRecords();
    
    document.getElementById('searchBtn').addEventListener('click', searchRecords);
    
    const modal = document.getElementById('record-details-modal');
    const span = document.getElementsByClassName('close-btn')[0];
    
    span.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});

async function fetchCounts() {
    try {
        const response = await fetch(`${API_URL}?action=getCounts&countType=total`);
        const counts = await response.json();
        document.getElementById('householdCount').textContent = counts.totalHouseholds;
        document.getElementById('memberCount').textContent = counts.totalMembers;
        document.getElementById('childrenCount').textContent = counts.totalChildren;
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

async function fetchRecords() {
    try {
        const response = await fetch(`${API_URL}?action=getRecords`);
        const records = await response.json();
        displayRecords(records);
    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

async function searchRecords() {
    const query = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`${API_URL}?action=searchRecords&query=${encodeURIComponent(query)}`);
        const records = await response.json();
        displayRecords(records);
    } catch (error) {
        console.error('Error searching records:', error);
    }
}

function displayRecords(records) {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';
    
    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No records found.</td></tr>';
        return;
    }
    
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.BlockName || ''}</td>
            <td>${record.ResidentialAddress || ''}</td>
            <td>${record.ContactNo || ''}</td>
            <td class="action-buttons">
                <button class="view-btn" onclick="viewRecord('${record.HouseholdID}')">View</button>
                <button class="edit-btn" onclick="editRecord('${record.HouseholdID}')">Edit</button>
                <button class="delete-btn" onclick="deleteRecord('${record.HouseholdID}')">Delete</button>
                <button class="print-btn" onclick="printRecord('${record.HouseholdID}')">Print</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function viewRecord(householdID) {
    try {
        const response = await fetch(`${API_URL}?action=getRecordDetails&householdID=${householdID}`);
        const record = await response.json();
        const modalContent = document.getElementById('record-details-content');
        modalContent.innerHTML = generateRecordHtml(record);
        document.getElementById('record-details-modal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing record:', error);
    }
}

async function editRecord(householdID) {
    // Navigate to a new page or show a new modal for editing
    // For simplicity, let's just log the action here
    console.log(`Editing record with ID: ${householdID}`);
}

async function deleteRecord(householdID) {
    if (!confirm('Are you sure you want to delete this record?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}?action=deleteRecord`, {
            method: 'POST',
            body: JSON.stringify({ householdID }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('Record deleted successfully.');
            fetchRecords();
            fetchCounts();
        } else {
            alert('Failed to delete record: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting record:', error);
        alert('An error occurred while deleting the record.');
    }
}

async function printRecord(householdID) {
    try {
        const response = await fetch(`${API_URL}?action=getRecordToPrint&householdID=${householdID}`);
        const record = await response.json();
        
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Household Record</title>');
        printWindow.document.write('<link rel="stylesheet" href="style.css">');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="print-content">');
        printWindow.document.write('<h1>Household Record</h1>');
        printWindow.document.write(generateRecordHtml(record));
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = function() {
            printWindow.print();
        };
    } catch (error) {
        console.error('Error printing record:', error);
    }
}

function generateRecordHtml(record) {
    let html = `
        <fieldset>
            <legend>Household Information</legend>
            <p><strong>Household ID:</strong> ${record.household.HouseholdID || ''}</p>
            <p><strong>Block Name:</strong> ${record.household.BlockName || ''}</p>
            <p><strong>Residential Address:</strong> ${record.household.ResidentialAddress || ''}</p>
            <p><strong>Contact No:</strong> ${record.household.ContactNo || ''}</p>
        </fieldset>
        
        <fieldset>
            <legend>Members</legend>
    `;
    
    if (record.members && record.members.length > 0) {
        record.members.forEach(member => {
            html += `
                <div class="record-item">
                    <h3>${member.FirstName} ${member.LastName}</h3>
                    <p><strong>Date of Birth:</strong> ${member.DateOfBirth}</p>
                    <p><strong>Catholic:</strong> ${member.Catholic}</p>
                    <p><strong>Occupation:</strong> ${member.Occupation || ''}</p>
                    <p><strong>Church Activities:</strong> ${member.ChurchActivities || ''}</p>
                    <p><strong>Solidarity/Ministry:</strong> ${member.SolidarityMinistry || ''}</p>
                    <p><strong>Leadership:</strong> ${member.Leadership || ''}</p>
                    <p><strong>Baptism:</strong> ${member.Baptised || 'No'}</p>
                    ${member.Baptised === 'Yes' ? `
                        <p><strong>Date of Baptism:</strong> ${member.DateOfBaptism || ''}</p>
                        <p><strong>Reg No:</strong> ${member.BaptismRegistrationNo || ''}</p>
                        <p><strong>Church:</strong> ${member.BaptismChurch || ''}</p>
                        <p><strong>Location:</strong> ${member.BaptismLocation || ''}</p>
                    ` : ''}
                    <p><strong>1st Communion:</strong> ${member.FirstCommunion || 'No'}</p>
                    ${member.FirstCommunion === 'Yes' ? `
                        <p><strong>Date of 1st Communion:</strong> ${member.DateFirstCommunion || ''}</p>
                        <p><strong>Church:</strong> ${member.FirstCommunionChurch || ''}</p>
                    ` : ''}
                    <p><strong>Confirmation:</strong> ${member.Confirmation || 'No'}</p>
                    ${member.Confirmation === 'Yes' ? `
                        <p><strong>Date of Confirmation:</strong> ${member.DateOfConfirmation || ''}</p>
                        <p><strong>Church:</strong> ${member.ConfirmationChurch || ''}</p>
                    ` : ''}
                    <p><strong>Marital Status:</strong> ${member.MaritalStatus || ''}</p>
                    <p><strong>Civil Court Marriage Date:</strong> ${member.CivilCourtMarriageDate || ''}</p>
                    <p><strong>Church Marriage Date:</strong> ${member.ChurchMarriageDate || ''}</p>
                    <p><strong>Church Marriage Place:</strong> ${member.ChurchMarriagePlace || ''}</p>
                    <p><strong>Divorced:</strong> ${member.Divorced || 'No'}</p>
                    <p><strong>Dikabelo:</strong> ${member.Dikabelo || 'No'}</p>
                    ${member.Dikabelo === 'Yes' ? `
                        <p><strong>Date of Last Dikabelo:</strong> ${member.DateLastDikabelo || ''}</p>
                    ` : ''}
                </div>
            `;
        });
    } else {
        html += `<p>No members found.</p>`;
    }
    html += `</fieldset>`;

    html += `
        <fieldset>
            <legend>Children</legend>
    `;
    if (record.children && record.children.length > 0) {
        record.children.forEach(child => {
            html += `
                <div class="record-item">
                    <h3>${child.FirstName} ${child.LastName}</h3>
                    <p><strong>Date of Birth:</strong> ${child.DateOfBirth}</p>
                    <p><strong>Age:</strong> ${child.Age}</p>
                    <p><strong>Catholic:</strong> ${child.Catholic}</p>
                    <p><strong>Church Activities:</strong> ${child.ChurchActivities || ''}</p>
                    <p><strong>Baptism:</strong> ${child.Baptised || 'No'}</p>
                    ${child.Baptised === 'Yes' ? `
                        <p><strong>Date of Baptism:</strong> ${child.DateOfBaptism || ''}</p>
                        <p><strong>Reg No:</strong> ${child.BaptismRegistrationNo || ''}</p>
                        <p><strong>Church:</strong> ${child.BaptismChurch || ''}</p>
                        <p><strong>Location:</strong> ${child.BaptismLocation || ''}</p>
                    ` : ''}
                    <p><strong>1st Communion:</strong> ${child.FirstCommunion || 'No'}</p>
                    ${child.FirstCommunion === 'Yes' ? `
                        <p><strong>Date of 1st Communion:</strong> ${child.DateFirstCommunion || ''}</p>
                        <p><strong>Church:</strong> ${child.FirstCommunionChurch || ''}</p>
                    ` : ''}
                    <p><strong>Confirmation:</strong> ${child.Confirmation || 'No'}</p>
                    ${child.Confirmation === 'Yes' ? `
                        <p><strong>Date of Confirmation:</strong> ${child.DateOfConfirmation || ''}</p>
                        <p><strong>Church:</strong> ${child.ConfirmationChurch || ''}</p>
                    ` : ''}
                </div>
            `;
        });
    } else {
        html += `<p>No children found.</p>`;
    }
    html += `</fieldset>`;
    
    return html;
}
