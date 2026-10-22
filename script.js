let students = [];
let editIndex = -1;
const studentForm = document.getElementById("studentForm");
const rollNoInput = document.getElementById("rollNo");
const studentNameInput = document.getElementById("studentName");
const departmentInput = document.getElementById("department");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");
const studentTableBody = document.getElementById("studentTableBody");
const studentCount = document.getElementById("studentCount");
const noRecords = document.getElementById("noRecords");
const rollError = document.getElementById("rollError");
const nameError = document.getElementById("nameError");
const departmentError = document.getElementById("departmentError");
const emailError = document.getElementById("emailError");
const mobileError = document.getElementById("mobileError");

studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const student = {
        rollNo: rollNoInput.value.trim(),
        name: studentNameInput.value.trim(),
        department: departmentInput.value,
        email: emailInput.value.trim(),
        mobile: mobileInput.value.trim()
    };

    if (editIndex === -1) {

        students.push(student);

        alert("Student registered successfully!");

    } else {

        students[editIndex] = student;

        alert("Student record updated successfully!");

        editIndex = -1;

        submitBtn.textContent = "Add Student";
    }

    clearForm();
    displayStudents();
});

// Form Validation
function validateForm() {
    let isValid = true;
    clearErrors();
    const rollNo = rollNoInput.value.trim();
    const name = studentNameInput.value.trim();
    const department = departmentInput.value;
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();

    if (rollNo === "") {

        rollError.textContent = "Roll number is required.";
        isValid = false;

    } else if (!/^[A-Za-z0-9-]+$/.test(rollNo)) {

        rollError.textContent = "Enter a valid roll number.";
        isValid = false;

    } else {

        const duplicate = students.some((student, index) => {
            return student.rollNo.toLowerCase() === rollNo.toLowerCase()
                && index !== editIndex;
        });

        if (duplicate) {
            rollError.textContent = "Roll number already exists.";
            isValid = false;
        }
    }  

    if (name === "") {

        nameError.textContent = "Name is required.";
        isValid = false;

    } else if (!/^[A-Za-z\s]+$/.test(name)) {

        nameError.textContent = "Name should contain only letters.";
        isValid = false;

    } else if (name.length < 2) {

        nameError.textContent = "Name must contain at least 2 characters.";
        isValid = false;
    }

    if (department === "") {

        departmentError.textContent = "Please select a department.";
        isValid = false;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {

        emailError.textContent = "Email is required.";
        isValid = false;

    } else if (!emailPattern.test(email)) {

        emailError.textContent = "Enter a valid email address.";
        isValid = false;
    }

    if (mobile === "") {

        mobileError.textContent = "Mobile number is required.";
        isValid = false;

    } else if (!/^[6-9]\d{9}$/.test(mobile)) {

        mobileError.textContent =
            "Enter a valid 10-digit mobile number.";
        isValid = false;
    }


    return isValid;
}

// Clear Validation Errors
function clearErrors() {

    rollError.textContent = "";
    nameError.textContent = "";
    departmentError.textContent = "";
    emailError.textContent = "";
    mobileError.textContent = "";
}

// Display Students Using DOM
function displayStudents(searchTerm = "") {

    studentTableBody.innerHTML = "";

    const filteredStudents = students.filter(student => {

        const searchText = searchTerm.toLowerCase();

        return (
            student.rollNo.toLowerCase().includes(searchText) ||
            student.name.toLowerCase().includes(searchText) ||
            student.department.toLowerCase().includes(searchText) ||
            student.email.toLowerCase().includes(searchText) ||
            student.mobile.includes(searchText)
        );
    });


    if (filteredStudents.length === 0) {

        noRecords.style.display = "block";

    } else {

        noRecords.style.display = "none";
    }


    filteredStudents.forEach((student) => {

        const originalIndex = students.indexOf(student);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${originalIndex + 1}</td>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td>${student.email}</td>
            <td>${student.mobile}</td>

            <td>
                <button 
                    class="btn edit-btn"
                    onclick="editStudent(${originalIndex})">
                    Edit
                </button>

                <button 
                    class="btn delete-btn"
                    onclick="deleteStudent(${originalIndex})">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });


    updateStudentCount(filteredStudents.length);
}
// Update Student Count
function updateStudentCount(count) {

    if (searchInput.value.trim() !== "") {

        studentCount.textContent =
            `${count} result${count !== 1 ? "s" : ""} found`;

    } else {

        studentCount.textContent =
            `${students.length} Student${students.length !== 1 ? "s" : ""}`;
    }
}
// Edit Student
function editStudent(index) {

    const student = students[index];

    rollNoInput.value = student.rollNo;
    studentNameInput.value = student.name;
    departmentInput.value = student.department;
    emailInput.value = student.email;
    mobileInput.value = student.mobile;

    editIndex = index;

    submitBtn.textContent = "Update Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// Delete Student
function deleteStudent(index) {

    const student = students[index];

    const confirmation = confirm(
        `Are you sure you want to delete ${student.name}'s record?`
    );

    if (!confirmation) {
        return;
    }

    students.splice(index, 1);

    if (editIndex === index) {

        editIndex = -1;
        submitBtn.textContent = "Add Student";

        clearForm();
    }

    displayStudents(searchInput.value.trim());

    alert("Student record deleted successfully.");
}
// Search Students
searchInput.addEventListener("input", function () {

    const searchTerm = searchInput.value.trim();

    displayStudents(searchTerm);
});

// Reset Form
resetBtn.addEventListener("click", function () {

    clearForm();

    editIndex = -1;

    submitBtn.textContent = "Add Student";
});

// Clear Form Function
function clearForm() {

    studentForm.reset();

    clearErrors();
}
// Clear All Student Records
clearAllBtn.addEventListener("click", function () {

    if (students.length === 0) {

        alert("There are no student records to clear.");
        return;
    }

    const confirmation = confirm(
        "Are you sure you want to clear all student records?"
    );

    if (!confirmation) {
        return;
    }

    students = [];

    editIndex = -1;

    clearForm();

    submitBtn.textContent = "Add Student";

    displayStudents();

    alert("All student records have been cleared.");
});
// Initial Display
displayStudents();