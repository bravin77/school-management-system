"use strict";

/*
=========================================================
MARKS MANAGEMENT
=========================================================
*/

const MARKS_API =
    "https://school-management-backend-igpt.onrender.com/api/marks/";

const STUDENTS_API =
    "https://school-management-backend-igpt.onrender.com/api/students/";

const SUBJECTS_API =
    "https://school-management-backend-igpt.onrender.com/api/subjects/";

let marks = [];
let students = [];
let subjects = [];


/*
=========================================================
PAGE INITIALIZATION
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "MARKS.JS LOADED"
        );


        loadStudents();
        loadSubjects();
        loadMarks();


        const form =
            document.getElementById(
                "marksForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                saveMark
            );

        }

    }
);


/*
=========================================================
LOAD STUDENTS
=========================================================
*/

async function loadStudents() {

    const select =
        document.getElementById(
            "markStudent"
        );


    if (!select) {

        console.error(
            "markStudent element not found."
        );

        return;

    }


    try {

        select.innerHTML =
            '<option value="">Loading students...</option>';


        const response =
            await fetch(
                STUDENTS_API,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store"
                }
            );


        console.log(
            "Students API status:",
            response.status
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
                : (
                    data &&
                    Array.isArray(data.results)
                        ? data.results
                        : []
                );


        console.log(
            "Students loaded:",
            students
        );


        select.innerHTML =
            '<option value="">Select student</option>';


        students.forEach(
            function (student) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    student.id;


                option.textContent =
                    student.name;


                select.appendChild(
                    option
                );

            }
        );


        if (students.length === 0) {

            select.innerHTML =
                '<option value="">No students available</option>';

        }

    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );


        select.innerHTML =
            '<option value="">Failed to load students</option>';

    }

}


/*
=========================================================
LOAD SUBJECTS
=========================================================
*/

async function loadSubjects() {

    const select =
        document.getElementById(
            "markSubject"
        );


    if (!select) {

        console.error(
            "markSubject element not found."
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
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store"
                }
            );


        console.log(
            "Subjects API status:",
            response.status
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
                : (
                    data &&
                    Array.isArray(data.results)
                        ? data.results
                        : []
                );


        console.log(
            "Subjects loaded:",
            subjects
        );


        select.innerHTML =
            '<option value="">Select subject</option>';


        subjects.forEach(
            function (subject) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    subject.id;


                option.textContent =
                    subject.name;


                select.appendChild(
                    option
                );

            }
        );


        if (subjects.length === 0) {

            select.innerHTML =
                '<option value="">No subjects available</option>';

        }

    } catch (error) {

        console.error(
            "Subject loading error:",
            error
        );


        select.innerHTML =
            '<option value="">Failed to load subjects</option>';

    }

}


/*
=========================================================
LOAD MARKS
=========================================================
*/

async function loadMarks() {

    const tbody =
        document.getElementById(
            "marksTableBody"
        );


    if (!tbody) {

        console.error(
            "marksTableBody not found."
        );

        return;

    }


    try {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Loading marks...
                </td>
            </tr>
        `;


        const response =
            await fetch(
                MARKS_API,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store"
                }
            );


        console.log(
            "Marks API status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load marks: HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        marks =
            Array.isArray(data)
                ? data
                : (
                    data &&
                    Array.isArray(data.results)
                        ? data.results
                        : []
                );


        console.log(
            "Marks loaded:",
            marks
        );


        displayMarks();

    } catch (error) {

        console.error(
            "Marks loading error:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load marks.
                </td>
            </tr>
        `;

    }

}


/*
=========================================================
DISPLAY MARKS
=========================================================
*/

function displayMarks() {

    const tbody =
        document.getElementById(
            "marksTableBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    if (marks.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No marks recorded.
                </td>
            </tr>
        `;

        return;

    }


    marks.forEach(
        function (mark) {

            const row =
                document.createElement(
                    "tr"
                );


            const studentName =
                mark.student_name ||
                getStudentName(
                    mark.student
                );


            const subjectName =
                mark.subject_name ||
                getSubjectName(
                    mark.subject
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(mark.id)}
                </td>

                <td>
                    ${escapeHTML(studentName)}
                </td>

                <td>
                    ${escapeHTML(subjectName)}
                </td>

                <td>
                    ${escapeHTML(mark.score)}
                </td>

                <td class="actions">

                    <button
                        type="button"
                        class="btn-edit"
                        data-id="${mark.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-delete"
                        data-id="${mark.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            const editButton =
                row.querySelector(
                    ".btn-edit"
                );


            const deleteButton =
                row.querySelector(
                    ".btn-delete"
                );


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    function () {

                        editMark(
                            mark.id
                        );

                    }
                );

            }


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteMark(
                            mark.id
                        );

                    }
                );

            }


            tbody.appendChild(
                row
            );

        }
    );

}


/*
=========================================================
GET STUDENT NAME
=========================================================
*/

function getStudentName(id) {

    const student =
        students.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    return student
        ? student.name
        : `Student #${id}`;

}


/*
=========================================================
GET SUBJECT NAME
=========================================================
*/

function getSubjectName(id) {

    const subject =
        subjects.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    return subject
        ? subject.name
        : `Subject #${id}`;

}


/*
=========================================================
SAVE / UPDATE MARK
=========================================================
*/

async function saveMark(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "markId"
        ).value;


    const student =
        document.getElementById(
            "markStudent"
        ).value;


    const subject =
        document.getElementById(
            "markSubject"
        ).value;


    const score =
        document.getElementById(
            "markScore"
        ).value;


    if (!student) {

        alert(
            "Please select a student."
        );

        return;

    }


    if (!subject) {

        alert(
            "Please select a subject."
        );

        return;

    }


    if (
        score === "" ||
        Number(score) < 0 ||
        Number(score) > 100
    ) {

        alert(
            "Score must be between 0 and 100."
        );

        return;

    }


    const payload = {

        student:
            Number(student),

        subject:
            Number(subject),

        score:
            Number(score)

    };


    const url =
        id
            ? `${MARKS_API}${id}/`
            : MARKS_API;


    const method =
        id
            ? "PUT"
            : "POST";


    try {

        const response =
            await fetch(
                url,
                {
                    method:
                        method,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                `HTTP ${response.status}`
            );

        }


        alert(
            id
                ? "Mark updated successfully."
                : "Mark saved successfully."
        );


        resetMarkForm();


        await loadMarks();

    } catch (error) {

        console.error(
            "Mark save error:",
            error
        );


        alert(
            "Failed to save mark.\n\n" +
            error.message
        );

    }

}


/*
=========================================================
EDIT MARK
=========================================================
*/

function editMark(id) {

    const mark =
        marks.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!mark) {

        alert(
            "Mark record not found."
        );

        return;

    }


    document.getElementById(
        "markId"
    ).value =
        mark.id;


    document.getElementById(
        "markStudent"
    ).value =
        mark.student;


    document.getElementById(
        "markSubject"
    ).value =
        mark.subject;


    document.getElementById(
        "markScore"
    ).value =
        mark.score;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/*
=========================================================
DELETE MARK
=========================================================
*/

async function deleteMark(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this mark?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${MARKS_API}${id}/`,
                {
                    method:
                        "DELETE",

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
            "Mark deleted successfully."
        );


        resetMarkForm();


        await loadMarks();

    } catch (error) {

        console.error(
            "Delete mark error:",
            error
        );


        alert(
            "Failed to delete mark.\n\n" +
            error.message
        );

    }

}


/*
=========================================================
RESET FORM
=========================================================
*/

function resetMarkForm() {

    const form =
        document.getElementById(
            "marksForm"
        );


    if (form) {

        form.reset();

    }


    const idInput =
        document.getElementById(
            "markId"
        );


    if (idInput) {

        idInput.value =
            "";

    }

}


/*
=========================================================
ESCAPE HTML
=========================================================
*/

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}