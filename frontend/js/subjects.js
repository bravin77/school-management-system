"use strict";

const SUBJECTS_API = "/api/subjects/";
const TEACHERS_API = "/api/teachers/";

let subjects = [];
let teachers = [];

document.addEventListener("DOMContentLoaded", function () {

    loadTeachers();
    loadSubjects();

    const form = document.getElementById("subjectForm");

    if (form) {
        form.addEventListener("submit", saveSubject);
    }

});


async function loadTeachers() {

    try {

        const response = await fetch(TEACHERS_API);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        teachers = Array.isArray(data)
            ? data
            : data.results || [];

        const select =
            document.getElementById("subjectTeacher");

        if (!select) {
            console.error("subjectTeacher not found");
            return;
        }

        select.innerHTML =
            '<option value="">Select teacher</option>';

        teachers.forEach(function (teacher) {

            const option =
                document.createElement("option");

            option.value = teacher.id;
            option.textContent = teacher.name;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Could not load teachers:",
            error
        );

    }

}


async function loadSubjects() {

    try {

        const response =
            await fetch(
                SUBJECTS_API,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        subjects = Array.isArray(data)
            ? data
            : data.results || [];

        displaySubjects();

    } catch (error) {

        console.error(
            "Could not load subjects:",
            error
        );

    }

}


function displaySubjects() {

    const tbody =
        document.getElementById(
            "subjectsTableBody"
        );

    if (!tbody) {
        console.error(
            "subjectsTableBody not found"
        );
        return;
    }

    tbody.innerHTML = "";

    subjects.forEach(function (subject) {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${subject.id}</td>

            <td>${escapeHTML(subject.name)}</td>

            <td>
                ${escapeHTML(
                    subject.teacher_name || ""
                )}
            </td>

            <td>

                <button
                    type="button"
                    onclick="editSubject(${subject.id})">
                    Edit
                </button>

                <button
                    type="button"
                    onclick="deleteSubject(${subject.id})">
                    Delete
                </button>

            </td>
        `;

        tbody.appendChild(row);

    });

}


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

        alert("Enter subject name.");

        return;

    }


    if (!teacher) {

        alert("Select a teacher.");

        return;

    }


    const payload = {

        name: name,

        teacher: Number(teacher)

    };


    let url = SUBJECTS_API;
    let method = "POST";


    if (id) {

        url =
            `${SUBJECTS_API}${id}/`;

        method = "PUT";

    }


    try {

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


        if (!response.ok) {

            throw new Error(
                text ||
                `HTTP ${response.status}`
            );

        }


        console.log(
            "Subject saved:",
            text
        );


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
        ).value = "";


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


function editSubject(id) {

    const subject =
        subjects.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!subject) {
        return;
    }


    document.getElementById(
        "subjectId"
    ).value = subject.id;

    document.getElementById(
        "subjectName"
    ).value = subject.name;

    document.getElementById(
        "subjectTeacher"
    ).value = subject.teacher;

}


async function deleteSubject(id) {

    if (
        !confirm(
            "Delete this subject?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${SUBJECTS_API}${id}/`,
                {
                    method: "DELETE"
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

        console.error(error);

        alert(
            "Failed to delete subject."
        );

    }

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}