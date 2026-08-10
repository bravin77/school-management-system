"use strict";

const STUDENTS_API = "/api/students/";
const SUBJECTS_API = "/api/subjects/";

let students = [];
let subjects = [];


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSubjects();
        loadStudents();

        const form =
            document.getElementById(
                "studentForm"
            );

        if (form) {

            form.addEventListener(
                "submit",
                saveStudent
            );

        }

    }
);


async function loadSubjects() {

    try {

        const response =
            await fetch(SUBJECTS_API);

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
                : data.results || [];


        const select =
            document.getElementById(
                "studentSubjects"
            );


        if (!select) {

            console.error(
                "studentSubjects not found"
            );

            return;

        }


        select.innerHTML = "";


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


    } catch (error) {

        console.error(
            "Could not load subjects:",
            error
        );

    }

}


async function loadStudents() {

    try {

        const response =
            await fetch(
                STUDENTS_API,
                {
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


        students =
            Array.isArray(data)
                ? data
                : data.results || [];


        displayStudents();


    } catch (error) {

        console.error(
            "Could not load students:",
            error
        );

    }

}


function displayStudents() {

    const tbody =
        document.getElementById(
            "studentsTableBody"
        );


    if (!tbody) {

        console.error(
            "studentsTableBody not found"
        );

        return;

    }


    tbody.innerHTML = "";


    students.forEach(
        function (student) {

            const subjectsText =
                student.subject_names &&
                student.subject_names.length
                    ? student.subject_names.join(
                        ", "
                    )
                    : "No subjects";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>${student.id}</td>

                <td>
                    ${escapeHTML(
                        student.name
                    )}
                </td>

                <td>
                    ${student.age}
                </td>

                <td>
                    ${escapeHTML(
                        subjectsText
                    )}
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

        }
    );

}


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
            option =>
                Number(option.value)
        );


    if (!name) {

        alert(
            "Enter student name."
        );

        return;

    }


    if (!age) {

        alert(
            "Enter student age."
        );

        return;

    }


    const payload = {

        name: name,

        age: Number(age),

        subjects:
            selectedSubjects

    };


    let url =
        STUDENTS_API;

    let method =
        "POST";


    if (id) {

        url =
            `${STUDENTS_API}${id}/`;

        method =
            "PUT";

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


        console.log(
            "Student saved:",
            text
        );


        alert(
            id
                ? "Student updated successfully."
                : "Student saved successfully."
        );


        document.getElementById(
            "studentForm"
        ).reset();


        document.getElementById(
            "studentId"
        ).value = "";


        await loadStudents();


    } catch (error) {

        console.error(
            "Student save error:",
            error
        );


        alert(
            "Failed to save student:\n" +
            error.message
        );

    }

}


function editStudent(id) {

    const student =
        students.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!student) {
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


    Array.from(
        select.options
    ).forEach(
        function (option) {

            option.selected =
                student.subjects.includes(
                    Number(option.value)
                );

        }
    );

}


async function deleteStudent(id) {

    if (
        !confirm(
            "Delete this student?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${STUDENTS_API}${id}/`,
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
            "Student deleted successfully."
        );


        await loadStudents();


    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete student."
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