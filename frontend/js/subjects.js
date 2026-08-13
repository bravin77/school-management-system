"use strict";

/*
=========================================================
SUBJECT MANAGEMENT MODULE
=========================================================
*/

const SUBJECTS_API =
    "https://school-management-backend-igpt.onrender.com/api/subjects/";

const TEACHERS_API =
    "https://school-management-backend-igpt.onrender.com/api/teachers/";

let subjects = [];
let teachers = [];


/*
=========================================================
INITIALIZATION
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SUBJECTS.JS LOADED"
        );


        loadTeachers();
        loadSubjects();


        const form =
            document.getElementById(
                "subjectForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                saveSubject
            );

        }

    }
);


/*
=========================================================
LOAD TEACHERS
=========================================================
*/

async function loadTeachers() {

    const select =
        document.getElementById(
            "subjectTeacher"
        );


    if (!select) {

        console.error(
            "subjectTeacher element not found."
        );

        return;

    }


    try {

        select.innerHTML =
            '<option value="">Loading teachers...</option>';


        const response =
            await fetch(
                TEACHERS_API,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        teachers =
            Array.isArray(data)
                ? data
                : (
                    data &&
                    Array.isArray(data.results)
                        ? data.results
                        : []
                );


        console.log(
            "Teachers loaded:",
            teachers
        );


        select.innerHTML =
            '<option value="">Select teacher</option>';


        teachers.forEach(
            function (teacher) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    teacher.id;


                option.textContent =
                    teacher.name;


                select.appendChild(
                    option
                );

            }
        );


        if (teachers.length === 0) {

            select.innerHTML =
                '<option value="">No teachers available</option>';

        }

    } catch (error) {

        console.error(
            "Could not load teachers:",
            error
        );


        select.innerHTML =
            '<option value="">Failed to load teachers</option>';

    }

}


/*
=========================================================
LOAD SUBJECTS
=========================================================
*/

async function loadSubjects() {

    const tbody =
        document.getElementById(
            "subjectsTableBody"
        );


    try {

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


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
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


        displaySubjects();

    } catch (error) {

        console.error(
            "Could not load subjects:",
            error
        );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Failed to load subjects.
                    </td>
                </tr>
            `;

        }

    }

}


/*
=========================================================
DISPLAY SUBJECTS
=========================================================
*/

function displaySubjects() {

    const tbody =
        document.getElementById(
            "subjectsTableBody"
        );


    if (!tbody) {

        console.error(
            "subjectsTableBody not found."
        );

        return;

    }


    tbody.innerHTML =
        "";


    if (subjects.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    No subjects found.
                </td>
            </tr>
        `;

        return;

    }


    subjects.forEach(
        function (subject) {

            const row =
                document.createElement(
                    "tr"
                );


            const teacherName =
                subject.teacher_name ||
                getTeacherName(
                    subject.teacher
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(subject.id)}
                </td>

                <td>
                    ${escapeHTML(subject.name)}
                </td>

                <td>
                    ${escapeHTML(teacherName)}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-edit"
                        data-id="${subject.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-delete"
                        data-id="${subject.id}"
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

                        editSubject(
                            subject.id
                        );

                    }
                );

            }


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteSubject(
                            subject.id
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
GET TEACHER NAME
=========================================================
*/

function getTeacherName(id) {

    const teacher =
        teachers.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    return teacher
        ? teacher.name
        : `Teacher #${id}`;

}


/*
=========================================================
SAVE / UPDATE SUBJECT
=========================================================
*/

async function saveSubject(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "subjectId"
        ).value;


    const name =
        document.getElementById(
            "subjectName"
        ).value.trim();


    const teacher =
        document.getElementById(
            "subjectTeacher"
        ).value;


    if (!name) {

        alert(
            "Enter subject name."
        );

        return;

    }


    if (!teacher) {

        alert(
            "Select a teacher."
        );

        return;

    }


    const payload = {

        name:
            name,

        teacher:
            Number(teacher)

    };


    const url =
        id
            ? `${SUBJECTS_API}${id}/`
            : SUBJECTS_API;


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
                ? "Subject updated successfully."
                : "Subject saved successfully."
        );


        document.getElementById(
            "subjectForm"
        ).reset();


        document.getElementById(
            "subjectId"
        ).value =
            "";


        await loadSubjects();

    } catch (error) {

        console.error(
            "Subject save error:",
            error
        );


        alert(
            "Failed to save subject:\n" +
            error.message
        );

    }

}


/*
=========================================================
EDIT SUBJECT
=========================================================
*/

function editSubject(id) {

    const subject =
        subjects.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!subject) {

        alert(
            "Subject not found."
        );

        return;

    }


    document.getElementById(
        "subjectId"
    ).value =
        subject.id;


    document.getElementById(
        "subjectName"
    ).value =
        subject.name;


    document.getElementById(
        "subjectTeacher"
    ).value =
        subject.teacher;

}


/*
=========================================================
DELETE SUBJECT
=========================================================
*/

async function deleteSubject(id) {

    const confirmed =
        confirm(
            "Delete this subject?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${SUBJECTS_API}${id}/`,
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

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        alert(
            "Subject deleted successfully."
        );


        await loadSubjects();

    } catch (error) {

        console.error(
            "Subject delete error:",
            error
        );


        alert(
            "Failed to delete subject:\n" +
            error.message
        );

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