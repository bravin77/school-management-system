"use strict";

/*
=========================================================
STUDENT MANAGEMENT MODULE
=========================================================
*/

const STUDENTS_API = "/api/students/";
const SUBJECTS_API = "/api/subjects/";

let students = [];
let subjects = [];


/*
=========================================================
INITIALIZATION
=========================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    console.log("STUDENTS.JS LOADED");

    loadSubjects();
    loadStudents();

    const form = document.getElementById("studentForm");

    if (form) {
        form.addEventListener("submit", saveStudent);
    }

});


/*
=========================================================
LOAD SUBJECTS
=========================================================
*/

async function loadSubjects() {

    try {

        console.log("Loading subjects...");

        subjects = await apiGetArray(SUBJECTS_API);

        const select =
            document.getElementById("studentSubjects");

        if (!select) {

            console.error(
                "studentSubjects not found in students.html"
            );

            return;
        }

        select.innerHTML = "";

        subjects.forEach(function (subject) {

            const option =
                document.createElement("option");

            option.value = subject.id;

            option.textContent = subject.name;

            select.appendChild(option);

        });

        console.log(
            "Subjects loaded:",
            subjects.length
        );

    } catch (error) {

        console.error(
            "Could not load subjects:",
            error
        );

    }

}


/*
=========================================================
LOAD STUDENTS
=========================================================
*/

async function loadStudents() {

    try {

        console.log("Loading students...");

        students = await apiGetArray(STUDENTS_API);

        console.log(
            "Students loaded:",
            students.length
        );

        displayStudents();

    } catch (error) {

        console.error(
            "Could not load students:",
            error
        );

    }

}


/*
=========================================================
DISPLAY STUDENTS
=========================================================
*/

function displayStudents() {

    const tbody =
        document.getElementById(
            "studentsTableBody"
        );

    if (!tbody) {

        console.error(
            "studentsTableBody not found in students.html"
        );

        return;
    }

    tbody.innerHTML = "";

    if (students.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    students.forEach(function (student) {

        const subjectsText =
            student.subject_names &&
            student.subject_names.length
                ? student.subject_names.join(", ")
                : "No subjects";

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${escapeHTML(student.id)}
            </td>

            <td>
                ${escapeHTML(student.name)}
            </td>

            <td>
                ${escapeHTML(student.age)}
            </td>

            <td>
                ${escapeHTML(subjectsText)}
            </td>

            <td>

                <button
                    type="button"
                    onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button
                    type="button"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>

        `;

        tbody.appendChild(row);

    });

}


/*
=========================================================
SAVE / UPDATE STUDENT
=========================================================
*/

async function saveStudent(event) {

    event.preventDefault();

    const id =
        document.getElementById(
            "studentId"
        ).value;

    const name =
        document.getElementById(
            "studentName"
        ).value.trim();

    const age =
        document.getElementById(
            "studentAge"
        ).value;

    const subjectSelect =
        document.getElementById(
            "studentSubjects"
        );

    const selectedSubjects =
        Array.from(
            subjectSelect.selectedOptions
        ).map(
            option => Number(option.value)
        );


    if (!name) {

        alert("Enter student name.");

        return;
    }


    if (!age) {

        alert("Enter student age.");

        return;
    }


    const payload = {

        name: name,

        age: Number(age),

        subjects: selectedSubjects

    };


    try {

        console.log(
            id
                ? "Updating student..."
                : "Saving student..."
        );


        if (id) {

            await apiPut(
                `${STUDENTS_API}${id}/`,
                payload
            );

            alert(
                "Student updated successfully."
            );

        } else {

            await apiPost(
                STUDENTS_API,
                payload
            );

            alert(
                "Student saved successfully."
            );

        }


        resetStudentForm();

        await loadStudents();


    } catch (error) {

        console.error(
            "Student save error:",
            error
        );

        alert(
            "Failed to save student:\n\n" +
            error.message
        );

    }

}


/*
=========================================================
EDIT STUDENT
=========================================================
*/

function editStudent(id) {

    const student =
        students.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!student) {

        alert("Student not found.");

        return;
    }


    document.getElementById(
        "studentId"
    ).value =
        student.id;


    document.getElementById(
        "studentName"
    ).value =
        student.name;


    document.getElementById(
        "studentAge"
    ).value =
        student.age;


    const select =
        document.getElementById(
            "studentSubjects"
        );


    if (select) {

        const studentSubjects =
            Array.isArray(student.subjects)
                ? student.subjects
                : [];

        Array.from(
            select.options
        ).forEach(
            function (option) {

                option.selected =
                    studentSubjects.includes(
                        Number(option.value)
                    );

            }
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/*
=========================================================
DELETE STUDENT
=========================================================
*/

async function deleteStudent(id) {

    const confirmed =
        confirm(
            "Delete this student?"
        );

    if (!confirmed) {
        return;
    }


    try {

        await apiDelete(
            `${STUDENTS_API}${id}/`
        );


        alert(
            "Student deleted successfully."
        );


        resetStudentForm();

        await loadStudents();


    } catch (error) {

        console.error(
            "Student delete error:",
            error
        );

        alert(
            "Failed to delete student:\n\n" +
            error.message
        );

    }

}


/*
=========================================================
RESET FORM
=========================================================
*/

function resetStudentForm() {

    const form =
        document.getElementById(
            "studentForm"
        );

    if (form) {
        form.reset();
    }


    const idInput =
        document.getElementById(
            "studentId"
        );

    if (idInput) {
        idInput.value = "";
    }

}


/*
=========================================================
ESCAPE HTML
=========================================================
*/

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}