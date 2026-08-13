"use strict";

/*
=========================================================
STUDENT MANAGEMENT MODULE
=========================================================
*/

const STUDENTS_API =
    "https://school-management-backend-igpt.onrender.com/api/students/";

const SUBJECTS_API =
    "https://school-management-backend-igpt.onrender.com/api/subjects/";

let students = [];
let subjects = [];


/*
=========================================================
INITIALIZATION
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

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

    const select =
        document.getElementById("studentSubjects");

    if (!select) {

        console.error(
            "studentSubjects element not found."
        );

        return;
    }

    try {

        select.innerHTML =
            '<option value="">Loading subjects...</option>';

        const response =
            await fetch(
                SUBJECTS_API,
                {
                    method: "GET",

                    headers: {
                        "Accept": "application/json"
                    },

                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Failed to load subjects: HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        subjects =
            Array.isArray(data)
                ? data
                : (Array.isArray(data.results)
                    ? data.results
                    : []);

        console.log(
            "Subjects loaded:",
            subjects
        );

        select.innerHTML =
            '<option value="">Select subject(s)</option>';

        if (subjects.length === 0) {

            select.innerHTML =
                '<option value="">No subjects available</option>';

            return;
        }

        subjects.forEach(subject => {

            const option =
                document.createElement("option");

            option.value =
                subject.id;

            option.textContent =
                subject.name;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Could not load subjects:",
            error
        );

        select.innerHTML =
            '<option value="">Failed to load subjects</option>';

    }

}


/*
=========================================================
LOAD STUDENTS
=========================================================
*/

async function loadStudents() {

    const tbody =
        document.getElementById(
            "studentsTableBody"
        );

    try {

        console.log(
            "Loading students from:",
            STUDENTS_API
        );

        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Loading students...
                    </td>
                </tr>
            `;

        }

        const response =
            await fetch(
                STUDENTS_API,
                {
                    method: "GET",

                    headers: {
                        "Accept": "application/json"
                    },

                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Failed to load students: HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        students =
            Array.isArray(data)
                ? data
                : (Array.isArray(data.results)
                    ? data.results
                    : []);

        console.log(
            "Students loaded:",
            students
        );

        displayStudents();

    } catch (error) {

        console.error(
            "Could not load students:",
            error
        );

        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Failed to load students.
                    </td>
                </tr>
            `;

        }

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
            "studentsTableBody not found."
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

    students.forEach(student => {

        const row =
            document.createElement("tr");

        const subjectsText =
            Array.isArray(student.subject_names)
                ? student.subject_names.join(", ")
                : "No subjects";

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

            <td class="actions">

                <button
                    type="button"
                    class="btn-edit"
                    data-id="${student.id}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn-delete"
                    data-id="${student.id}"
                >
                    Delete
                </button>

            </td>

        `;

        const editButton =
            row.querySelector(".btn-edit");

        const deleteButton =
            row.querySelector(".btn-delete");

        if (editButton) {

            editButton.addEventListener(
                "click",
                () => editStudent(student.id)
            );

        }

        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                () => deleteStudent(student.id)
            );

        }

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


    if (!name) {

        alert("Enter student name.");

        return;
    }


    if (!age) {

        alert("Enter student age.");

        return;
    }


    const selectedSubjects =
        subjectSelect
            ? Array.from(
                subjectSelect.selectedOptions
            ).map(
                option => Number(option.value)
            )
            : [];


    const payload = {

        name: name,

        age: Number(age),

        subjects: selectedSubjects

    };


    const url =
        id
            ? `${STUDENTS_API}${id}/`
            : STUDENTS_API;

    const method =
        id
            ? "PUT"
            : "POST";


    try {

        console.log(
            `${method} student request:`,
            url,
            payload
        );

        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body:
                        JSON.stringify(payload)

                }
            );


        const text =
            await response.text();


        console.log(
            "Student save response:",
            text
        );


        if (!response.ok) {

            throw new Error(
                text ||
                `HTTP ${response.status}`
            );

        }


        alert(
            id
                ? "Student updated successfully."
                : "Student saved successfully."
        );


        resetStudentForm();

        await loadStudents();

    } catch (error) {

        console.error(
            "Student save error:",
            error
        );

        alert(
            "Failed to save student.\n\n" +
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
                ? student.subjects.map(Number)
                : [];


        Array.from(
            select.options
        ).forEach(option => {

            option.selected =
                studentSubjects.includes(
                    Number(option.value)
                );

        });

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

    const student =
        students.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    const studentName =
        student
            ? student.name
            : "this student";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${studentName}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${STUDENTS_API}${id}/`,
                {
                    method: "DELETE",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                `HTTP ${response.status}`
            );

        }


        alert(
            "Student deleted successfully."
        );


        await loadStudents();

    } catch (error) {

        console.error(
            "Student delete error:",
            error
        );

        alert(
            "Failed to delete student.\n\n" +
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