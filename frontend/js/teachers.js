"use strict";

/*
=========================================================
TEACHER MANAGEMENT MODULE
=========================================================
*/

const TEACHERS_API_URL =
    "https://school-management-backend-igpt.onrender.com/api/teachers/";

let teachers = [];


/*
=========================================================
DOM ELEMENT REFERENCES
=========================================================
*/

let teacherForm = null;
let teacherIdInput = null;
let teacherNameInput = null;
let teacherEmailInput = null;
let teacherTableBody = null;
let teacherTable = null;
let teacherLoading = null;
let noTeachersMessage = null;
let teacherMessage = null;
let teacherFormTitle = null;
let teacherSubmitButton = null;
let cancelTeacherEditButton = null;


/*
=========================================================
INITIALIZATION
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "TEACHERS.JS LOADED"
        );


        /*
        Get DOM elements only after
        the HTML has loaded.
        */

        teacherForm =
            document.getElementById(
                "teacherForm"
            );

        teacherIdInput =
            document.getElementById(
                "teacherId"
            );

        teacherNameInput =
            document.getElementById(
                "teacherName"
            );

        teacherEmailInput =
            document.getElementById(
                "teacherEmail"
            );

        teacherTableBody =
            document.getElementById(
                "teachersTableBody"
            );

        teacherTable =
            document.getElementById(
                "teachersTable"
            );

        teacherLoading =
            document.getElementById(
                "teacherLoading"
            );

        noTeachersMessage =
            document.getElementById(
                "noTeachersMessage"
            );

        teacherMessage =
            document.getElementById(
                "teacherMessage"
            );

        teacherFormTitle =
            document.getElementById(
                "teacherFormTitle"
            );

        teacherSubmitButton =
            document.getElementById(
                "teacherSubmitButton"
            );

        cancelTeacherEditButton =
            document.getElementById(
                "cancelTeacherEdit"
            );


        /*
        Attach form event.
        */

        if (teacherForm) {

            teacherForm.addEventListener(
                "submit",
                saveTeacher
            );

        }


        /*
        Cancel edit button.
        */

        if (cancelTeacherEditButton) {

            cancelTeacherEditButton.addEventListener(
                "click",
                function () {

                    resetTeacherForm();

                    clearMessage();

                }
            );

        }


        /*
        Table button events.
        */

        if (teacherTableBody) {

            teacherTableBody.addEventListener(
                "click",
                handleTeacherTableClick
            );

        }


        /*
        Load teachers.
        */

        loadTeachers();

    }
);


/*
=========================================================
DISPLAY MESSAGE
=========================================================
*/

function showMessage(
    message,
    success = true
) {

    if (!teacherMessage) {

        return;

    }

    teacherMessage.textContent =
        message;

    teacherMessage.style.display =
        "block";

    teacherMessage.style.color =
        success
            ? "green"
            : "red";

}


/*
=========================================================
CLEAR MESSAGE
=========================================================
*/

function clearMessage() {

    if (!teacherMessage) {

        return;

    }

    teacherMessage.textContent =
        "";

    teacherMessage.style.display =
        "none";

}


/*
=========================================================
LOAD TEACHERS
=========================================================
*/

async function loadTeachers() {

    console.log(
        "Loading teachers from:",
        TEACHERS_API_URL
    );


    if (teacherLoading) {

        teacherLoading.style.display =
            "block";

        teacherLoading.textContent =
            "Loading teachers...";

    }


    try {

        const response =
            await fetch(
                TEACHERS_API_URL,
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
            "Teachers response status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Teachers received:",
            data
        );


        if (Array.isArray(data)) {

            teachers =
                data;

        } else if (
            data &&
            Array.isArray(data.results)
        ) {

            teachers =
                data.results;

        } else {

            throw new Error(
                "Unexpected API response format."
            );

        }


        renderTeachers();

    } catch (error) {

        console.error(
            "Failed to load teachers:",
            error
        );


        if (teacherLoading) {

            teacherLoading.textContent =
                "Failed to load teachers.";

        }


        if (teacherTable) {

            teacherTable.style.display =
                "none";

        }


        if (noTeachersMessage) {

            noTeachersMessage.style.display =
                "none";

        }


        showMessage(
            "Unable to load teachers. Check the browser console.",
            false
        );

    }

}


/*
=========================================================
DISPLAY TEACHERS
=========================================================
*/

function renderTeachers() {

    if (!teacherTableBody) {

        console.error(
            "teachersTableBody was not found."
        );

        return;

    }


    teacherTableBody.innerHTML =
        "";


    if (teacherLoading) {

        teacherLoading.style.display =
            "none";

    }


    if (teachers.length === 0) {

        if (teacherTable) {

            teacherTable.style.display =
                "none";

        }


        if (noTeachersMessage) {

            noTeachersMessage.style.display =
                "block";

        }


        return;

    }


    if (teacherTable) {

        teacherTable.style.display =
            "table";

    }


    if (noTeachersMessage) {

        noTeachersMessage.style.display =
            "none";

    }


    teachers.forEach(
        function (teacher) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(teacher.id)}
                </td>

                <td>
                    ${escapeHTML(teacher.name)}
                </td>

                <td>
                    ${escapeHTML(teacher.email)}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-teacher-button"
                        data-id="${teacher.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-teacher-button"
                        data-id="${teacher.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            teacherTableBody.appendChild(
                row
            );

        }
    );

}


/*
=========================================================
TABLE BUTTON EVENTS
=========================================================
*/

function handleTeacherTableClick(
    event
) {

    const target =
        event.target;


    if (
        target.classList.contains(
            "edit-teacher-button"
        )
    ) {

        editTeacher(
            target.dataset.id
        );

        return;

    }


    if (
        target.classList.contains(
            "delete-teacher-button"
        )
    ) {

        deleteTeacher(
            target.dataset.id
        );

    }

}


/*
=========================================================
SAVE / UPDATE TEACHER
=========================================================
*/

async function saveTeacher(event) {

    event.preventDefault();


    clearMessage();


    const id =
        teacherIdInput
            ? teacherIdInput.value.trim()
            : "";


    const name =
        teacherNameInput
            ? teacherNameInput.value.trim()
            : "";


    const email =
        teacherEmailInput
            ? teacherEmailInput.value.trim()
            : "";


    if (!name) {

        showMessage(
            "Please enter the teacher's name.",
            false
        );

        if (teacherNameInput) {

            teacherNameInput.focus();

        }

        return;

    }


    if (!email) {

        showMessage(
            "Please enter the teacher's email.",
            false
        );

        if (teacherEmailInput) {

            teacherEmailInput.focus();

        }

        return;

    }


    const teacherData = {

        name: name,

        email: email

    };


    const url =
        id
            ? `${TEACHERS_API_URL}${id}/`
            : TEACHERS_API_URL;


    const method =
        id
            ? "PUT"
            : "POST";


    try {

        if (teacherSubmitButton) {

            teacherSubmitButton.disabled =
                true;

            teacherSubmitButton.textContent =
                id
                    ? "Updating..."
                    : "Saving...";

        }


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
                            teacherData
                        )

                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            let errorMessage =
                responseText ||
                `HTTP ${response.status}`;


            try {

                const errorData =
                    JSON.parse(
                        responseText
                    );

                errorMessage =
                    JSON.stringify(
                        errorData
                    );

            } catch (error) {

                /*
                Keep original response text.
                */

            }


            throw new Error(
                errorMessage
            );

        }


        showMessage(
            id
                ? "Teacher updated successfully."
                : "Teacher saved successfully.",
            true
        );


        resetTeacherForm();


        await loadTeachers();

    } catch (error) {

        console.error(
            "Teacher save error:",
            error
        );


        showMessage(
            `Could not save teacher: ${error.message}`,
            false
        );

    } finally {

        if (teacherSubmitButton) {

            teacherSubmitButton.disabled =
                false;

            teacherSubmitButton.textContent =
                "Save Teacher";

        }

    }

}


/*
=========================================================
EDIT TEACHER
=========================================================
*/

function editTeacher(id) {

    const teacher =
        teachers.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!teacher) {

        console.error(
            "Teacher not found:",
            id
        );

        return;

    }


    if (teacherIdInput) {

        teacherIdInput.value =
            teacher.id;

    }


    if (teacherNameInput) {

        teacherNameInput.value =
            teacher.name;

    }


    if (teacherEmailInput) {

        teacherEmailInput.value =
            teacher.email;

    }


    if (teacherFormTitle) {

        teacherFormTitle.textContent =
            "Edit Teacher";

    }


    if (teacherSubmitButton) {

        teacherSubmitButton.textContent =
            "Update Teacher";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/*
=========================================================
DELETE TEACHER
=========================================================
*/

async function deleteTeacher(id) {

    const teacher =
        teachers.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    const teacherName =
        teacher
            ? teacher.name
            : "this teacher";


    const confirmed =
        window.confirm(
            `Are you sure you want to delete ${teacherName}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${TEACHERS_API_URL}${id}/`,
                {
                    method: "DELETE",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                `HTTP ${response.status}`
            );

        }


        showMessage(
            "Teacher deleted successfully.",
            true
        );


        await loadTeachers();

    } catch (error) {

        console.error(
            "Teacher delete error:",
            error
        );


        showMessage(
            `Could not delete teacher: ${error.message}`,
            false
        );

    }

}


/*
=========================================================
RESET FORM
=========================================================
*/

function resetTeacherForm() {

    if (teacherForm) {

        teacherForm.reset();

    }


    if (teacherIdInput) {

        teacherIdInput.value =
            "";

    }


    if (teacherFormTitle) {

        teacherFormTitle.textContent =
            "Add Teacher";

    }


    if (teacherSubmitButton) {

        teacherSubmitButton.textContent =
            "Save Teacher";

    }

}


/*
=========================================================
ESCAPE HTML
=========================================================
*/

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}