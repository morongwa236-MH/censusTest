/* --- Shared functions for dynamic form generation --- */
function createMemberForm(memberData = {}) {
    const memberId = memberData.MemberID || `new_member_${Date.now()}`;
    const formHtml = `
        <div class="member-form" id="${memberId}">
            <span class="remove-btn" onclick="removeForm(this)">❌ Remove Member</span>
            <hr>
            <label>First Name:</label>
            <input type="text" name="firstName" value="${memberData.FirstName || ''}" required>
            <label>Last Name:</label>
            <input type="text" name="lastName" value="${memberData.LastName || ''}" required>
            <label>Date of Birth:</label>
            <input type="date" name="dateOfBirth" value="${memberData.DateOfBirth || ''}">
            <label>Catholic?</label>
            <select name="isCatholic" onchange="toggleFields(this, 'member-${memberId}-catholic')">
                <option value="No" ${memberData.Catholic === 'No' ? 'selected' : ''}>No</option>
                <option value="Yes" ${memberData.Catholic === 'Yes' ? 'selected' : ''}>Yes</option>
            </select>
            <label>Occupation:</label>
            <input type="text" name="occupation" value="${memberData.Occupation || ''}">
            <label>Church Activities:</label>
            <input type="text" name="churchActivities" value="${memberData.ChurchActivities || ''}">
            <label>Solidarity/Ministry:</label>
            <input type="text" name="solidarityMinistry" value="${memberData.SolidarityMinistry || ''}">
            <label>Leadership:</label>
            <input type="text" name="leadership" value="${memberData.Leadership || ''}">

            <div class="sub-section">
                <h4>Baptism</h4>
                <label>Baptised?</label>
                <select name="isBaptised" onchange="toggleFields(this, 'member-${memberId}-baptism')">
                    <option value="No" ${memberData.Baptised === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${memberData.Baptised === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div id="member-${memberId}-baptism" class="optional-fields" style="display:${memberData.Baptised === 'Yes' ? 'block' : 'none'};">
                    <label>Date of Baptism:</label>
                    <input type="date" name="dateOfBaptism" value="${memberData.DateOfBaptism || ''}">
                    <label>Registration Number:</label>
                    <input type="text" name="baptismRegNo" value="${memberData.BaptismRegistrationNo || ''}">
                    <label>Church of Baptism:</label>
                    <input type="text" name="baptismChurch" value="${memberData.BaptismChurch || ''}">
                    <label>Location of Church:</label>
                    <input type="text" name="baptismLocation" value="${memberData.BaptismLocation || ''}">
                </div>
            </div>

            <div class="sub-section">
                <h4>1st Communion</h4>
                <label>1st Communion?</label>
                <select name="isFirstCommunion" onchange="toggleFields(this, 'member-${memberId}-communion')">
                    <option value="No" ${memberData.FirstCommunion === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${memberData.FirstCommunion === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div id="member-${memberId}-communion" class="optional-fields" style="display:${memberData.FirstCommunion === 'Yes' ? 'block' : 'none'};">
                    <label>Date of 1st Communion:</label>
                    <input type="date" name="dateFirstCommunion" value="${memberData.DateFirstCommunion || ''}">
                    <label>Church of 1st Communion:</label>
                    <input type="text" name="firstCommunionChurch" value="${memberData.FirstCommunionChurch || ''}">
                </div>
            </div>

            <div class="sub-section">
                <h4>Confirmation</h4>
                <label>Confirmed?</label>
                <select name="isConfirmation" onchange="toggleFields(this, 'member-${memberId}-confirmation')">
                    <option value="No" ${memberData.Confirmation === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${memberData.Confirmation === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div id="member-${memberId}-confirmation" class="optional-fields" style="display:${memberData.Confirmation === 'Yes' ? 'block' : 'none'};">
                    <label>Date of Confirmation:</label>
                    <input type="date" name="dateOfConfirmation" value="${memberData.DateOfConfirmation || ''}">
                    <label>Church of Confirmation:</label>
                    <input type="text" name="confirmationChurch" value="${memberData.ConfirmationChurch || ''}">
                </div>
            </div>

            <div class="sub-section">
                <h4>Marital Status</h4>
                <label>Marital Status:</label>
                <select name="maritalStatus">
                    <option value="">--Select--</option>
                    <option value="Single" ${memberData.MaritalStatus === 'Single' ? 'selected' : ''}>Single</option>
                    <option value="Married" ${memberData.MaritalStatus === 'Married' ? 'selected' : ''}>Married</option>
                    <option value="Widowed" ${memberData.MaritalStatus === 'Widowed' ? 'selected' : ''}>Widowed</option>
                </select>
                <label>Civil Court Marriage Date (Optional):</label>
                <input type="date" name="civilCourtMarriageDate" value="${memberData.CivilCourtMarriageDate || ''}">
                <label>Church Marriage Date (Optional):</label>
                <input type="date" name="churchMarriageDate" value="${memberData.ChurchMarriageDate || ''}">
                <label>Church Marriage Place (Optional):</label>
                <input type="text" name="churchMarriagePlace" value="${memberData.ChurchMarriagePlace || ''}">
                <label>Divorced?</label>
                <select name="isDivorced">
                    <option value="No" ${memberData.Divorced === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${memberData.Divorced === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
            </div>
            
            <div class="sub-section">
                <h4>Dikabelo</h4>
                <label>Dikabelo?</label>
                <select name="isDikabelo" onchange="toggleFields(this, 'member-${memberId}-dikabelo')">
                    <option value="No" ${memberData.Dikabelo === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${memberData.Dikabelo === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div id="member-${memberId}-dikabelo" class="optional-fields" style="display:${memberData.Dikabelo === 'Yes' ? 'block' : 'none'};">
                    <label>Date of Last Dikabelo:</label>
                    <input type="date" name="dateLastDikabelo" value="${memberData.DateLastDikabelo || ''}">
                </div>
            </div>
        </div>
    `;
    return formHtml;
}

function createChildForm(childData = {}) {
    const childId = childData.ChildID || `new_child_${Date.now()}`;
    const formHtml = `
        <div class="child-form" id="${childId}">
            <span class="remove-btn" onclick="removeForm(this)">❌ Remove Child</span>
            <hr>
            <label>First Name:</label>
            <input type="text" name="firstName" value="${childData.FirstName || ''}" required>
            <label>Last Name:</label>
            <input type="text" name="lastName" value="${childData.LastName || ''}" required>
            <label>Date of Birth:</label>
            <input type="date" name="dateOfBirth" value="${childData.DateOfBirth || ''}" onchange="calculateAge(this)">
            <label>Age:</label>
            <input type="number" name="age" value="${childData.Age || ''}" readonly>
            <label>Catholic?</label>
            <select name="isCatholic">
                <option value="No" ${childData.Catholic === 'No' ? 'selected' : ''}>No</option>
                <option value="Yes" ${childData.Catholic === 'Yes' ? 'selected' : ''}>Yes</option>
            </select>
            <label>Church Activities:</label>
            <input type="text" name="churchActivities" value="${childData.ChurchActivities || ''}">
            
            <div class="sub-section">
                <h4>Baptism</h4>
                <label>Baptised?</label>
                <select name="isBaptised" onchange="toggleFields(this, 'child-${childId}-baptism')">
                    <option value="No" ${childData.Baptised === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${childData.Baptised === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div id="child-${childId}-baptism" class="optional-fields" style="display:${childData.Baptised === 'Yes' ? 'block' : 'none'};">
                    <label>Date of Baptism:</label>
                    <input type="date" name="dateOfBaptism" value="${childData.DateOfBaptism || ''}">
                    <label>Registration Number:</label>
                    <input type="text" name="baptismRegNo" value="${childData.BaptismRegistrationNo || ''}">
                    <label>Church of Baptism:</label>
                    <input type="text" name="baptismChurch" value="${childData.BaptismChurch || ''}">
                    <label>Location of Church:</label>
                    <input type="text" name="baptismLocation" value="${childData.BaptismLocation || ''}">
                </div>
            </div>
            
            <div class="sub-section">
                <h4>1st Communion</h4>
                <label>1st Communion?</label>
                <select name="isFirstCommunion" onchange="toggleFields(this, 'child-${childId}-communion')">
                    <option value="No" ${childData.FirstCommunion === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${childData.FirstCommunion === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div id="child-${childId}-communion" class="optional-fields" style="display:${childData.FirstCommunion === 'Yes' ? 'block' : 'none'};">
                    <label>Date of 1st Communion:</label>
                    <input type="date" name="dateFirstCommunion" value="${childData.DateFirstCommunion || ''}">
                    <label>Church of 1st Communion:</label>
                    <input type="text" name="firstCommunionChurch" value="${childData.FirstCommunionChurch || ''}">
                </div>
            </div>

            <div class="sub-section">
                <h4>Confirmation</h4>
                <label>Confirmed?</label>
                <select name="isConfirmation" onchange="toggleFields(this, 'child-${childId}-confirmation')">
                    <option value="No" ${childData.Confirmation === 'No' ? 'selected' : ''}>No</option>
                    <option value="Yes" ${childData.Confirmation === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div id="child-${childId}-confirmation" class="optional-fields" style="display:${childData.Confirmation === 'Yes' ? 'block' : 'none'};">
                    <label>Date of Confirmation:</label>
                    <input type="date" name="dateOfConfirmation" value="${childData.DateOfConfirmation || ''}">
                    <label>Church of Confirmation:</label>
                    <input type="text" name="confirmationChurch" value="${childData.ConfirmationChurch || ''}">
                </div>
            </div>
        </div>
    `;
    return formHtml;
}

function toggleFields(selectElement, targetId) {
    const targetDiv = document.getElementById(targetId);
    if (selectElement.value === 'Yes') {
        targetDiv.style.display = 'block';
    } else {
        targetDiv.style.display = 'none';
    }
}

function removeForm(button) {
    button.closest('.member-form, .child-form').remove();
}

function calculateAge(input) {
    const dob = new Date(input.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    input.nextElementSibling.nextElementSibling.value = age;
}

// Function to collect all form data
function collectFormData() {
    const household = {
        blockName: document.getElementById('blockName').value,
        residentialAddress: document.getElementById('residentialAddress').value,
        contactNo: document.getElementById('contactNo').value
    };

    const members = [];
    document.querySelectorAll('#members-container .member-form').forEach(form => {
        const member = {};
        member.firstName = form.querySelector('[name="firstName"]').value;
        member.lastName = form.querySelector('[name="lastName"]').value;
        member.dateOfBirth = form.querySelector('[name="dateOfBirth"]').value;
        member.isCatholic = form.querySelector('[name="isCatholic"]').value;
        member.occupation = form.querySelector('[name="occupation"]').value;
        member.churchActivities = form.querySelector('[name="churchActivities"]').value;
        member.solidarityMinistry = form.querySelector('[name="solidarityMinistry"]').value;
        member.leadership = form.querySelector('[name="leadership"]').value;
        member.isBaptised = form.querySelector('[name="isBaptised"]').value;
        member.dateOfBaptism = form.querySelector('[name="dateOfBaptism"]').value;
        member.baptismRegNo = form.querySelector('[name="baptismRegNo"]').value;
        member.baptismChurch = form.querySelector('[name="baptismChurch"]').value;
        member.baptismLocation = form.querySelector('[name="baptismLocation"]').value;
        member.isFirstCommunion = form.querySelector('[name="isFirstCommunion"]').value;
        member.dateFirstCommunion = form.querySelector('[name="dateFirstCommunion"]').value;
        member.firstCommunionChurch = form.querySelector('[name="firstCommunionChurch"]').value;
        member.isConfirmation = form.querySelector('[name="isConfirmation"]').value;
        member.dateOfConfirmation = form.querySelector('[name="dateOfConfirmation"]').value;
        member.confirmationChurch = form.querySelector('[name="confirmationChurch"]').value;
        member.maritalStatus = form.querySelector('[name="maritalStatus"]').value;
        member.civilCourtMarriageDate = form.querySelector('[name="civilCourtMarriageDate"]').value;
        member.churchMarriageDate = form.querySelector('[name="churchMarriageDate"]').value;
        member.churchMarriagePlace = form.querySelector('[name="churchMarriagePlace"]').value;
        member.isDivorced = form.querySelector('[name="isDivorced"]').value;
        member.isDikabelo = form.querySelector('[name="isDikabelo"]').value;
        member.dateLastDikabelo = form.querySelector('[name="dateLastDikabelo"]').value;
        members.push(member);
    });

    const children = [];
    document.querySelectorAll('#children-container .child-form').forEach(form => {
        const child = {};
        child.firstName = form.querySelector('[name="firstName"]').value;
        child.lastName = form.querySelector('[name="lastName"]').value;
        child.dateOfBirth = form.querySelector('[name="dateOfBirth"]').value;
        child.age = form.querySelector('[name="age"]').value;
        child.isCatholic = form.querySelector('[name="isCatholic"]').value;
        child.churchActivities = form.querySelector('[name="churchActivities"]').value;
        child.isBaptised = form.querySelector('[name="isBaptised"]').value;
        child.dateOfBaptism = form.querySelector('[name="dateOfBaptism"]').value;
        child.baptismRegNo = form.querySelector('[name="baptismRegNo"]').value;
        child.baptismChurch = form.querySelector('[name="baptismChurch"]').value;
        child.baptismLocation = form.querySelector('[name="baptismLocation"]').value;
        child.isFirstCommunion = form.querySelector('[name="isFirstCommunion"]').value;
        child.dateFirstCommunion = form.querySelector('[name="dateFirstCommunion"]').value;
        child.firstCommunionChurch = form.querySelector('[name="firstCommunionChurch"]').value;
        child.isConfirmation = form.querySelector('[name="isConfirmation"]').value;
        child.dateOfConfirmation = form.querySelector('[name="dateOfConfirmation"]').value;
        child.confirmationChurch = form.querySelector('[name="confirmationChurch"]').value;
        children.push(child);
    });

    return { household, members, children };
}

// Function to handle form submission
if (document.getElementById('censusForm')) {
    document.getElementById('censusForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = collectFormData();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const response = await fetch(`${API_URL}?action=submitForm`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Form submitted successfully! Thank you.');
                e.target.reset();
                document.getElementById('members-container').innerHTML = '';
                document.getElementById('children-container').innerHTML = '';
                addMemberForm();
                addChildForm();
            } else {
                alert('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please check the console.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Form';
        }
    });

    function addMemberForm() {
        const membersContainer = document.getElementById('members-container');
        membersContainer.insertAdjacentHTML('beforeend', createMemberForm());
    }

    function addChildForm() {
        const childrenContainer = document.getElementById('children-container');
        childrenContainer.insertAdjacentHTML('beforeend', createChildForm());
    }

    document.getElementById('addMemberBtn').addEventListener('click', addMemberForm);
    document.getElementById('addChildBtn').addEventListener('click', addChildForm);
}
