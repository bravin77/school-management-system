"use strict";

/*
=========================================================
TEACHER MANAGEMENT MODULE
=========================================================

This module communicates directly with the Django REST API.

API:
    GET    /api/teachers/
    POST   /api/teachers/
    PUT    /api/teachers/<id>/
    DELETE /api/teachers/<id>/

This file deliberately does NOT depend on:
    getData()
    postData()
    putData()
    deleteData()

Everything uses the standard browser fetch() API.
=========================================================
*/


/* =====================================================
   API CONFIGURATION
===================================================== */

const TEACHERS_API_URL = "/api/teachers/";


/* =====================================================
   APPLICATION STATE
===================================================== */

let teachers = [];


/* =====================================================
   DOM ELEMENTS
===================================================== */

const teacherForm =
    document.getElementById("teacherForm");

const teacherIdInput =
    document.getElementById("teacherId");

const teacherNameInput =
    document.getElementById("teacherName");

const teacherEmailInput =
    document.getElementById("teacherEmail");

const teacherTableBody =
    document.getElementById("teachersTableBody");

const teacherTable =
    document.getElementById("teachersTable");

const teacherLoading =
    document.getElementById("teacherLoading");

const noTeachersMessage =
    document.getElementById("noTeachersMessage");

const teacherMessage =
    document.getElementById("teacherMessage");

const teacherFormTitle =
    document.getElementById("teacherFormTitle");

const teacherSubmitButton =
    document.getElementById("teacherSubmitButton");

const cancelTeacherEditButton =
    document.getElementById("cancelTeacherEdit");


/* =====================================================
   DISPLAY MESSAGE
===================================================== */

function showMessage(message, success = true) {

    if (!teacherMessage) {
        return;
    }

    teacherMessage.textContent = message;

    teacherMessage.style.display = "block";

    if (success) {

        teacherMessage.style.color = "green";

    } else {

        teacherMessage.style.color = "red";

    }

}


/* =====================================================
   CLEAR MESSAGE
===================================================== */

function clearMessage() {

    if (!teacherMessage) {
        return;
    }

    teacherMessage.textContent = "";

    teacherMessage.style.display = "none";

}


/* =====================================================
   LOAD TEACHERS
===================================================== */

async function loadTeachers() {

    console.log(
        "Loading teachers from:",
        TEACHERS_API_URL
    );

    if (teacherLoading) {

        teacherLoading.style.display = "block";

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
            "GET /api/teachers/ status:",
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


        /*
        Django REST Framework normally returns
        an array because pagination has not been
        configured for this endpoint.

        This extra check also makes the code robust
        if pagination is enabled later.
        */

        if (Array.isArray(data)) {

            teachers = data;

        } else if (
            data &&
            Array.isArray(data.results)
        ) {

            teachers = data.results;

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


/* =====================================================
   DISPLAY TEACHERS
===================================================== */

function renderTeachers() {

    if (!teacherTableBody) {

        console.error(
            "ERROR: teachersTableBody was not found in teachers.html."
        );

        return;

    }


    teacherTableBody.innerHTML = "";


    if (teacherLoading) {

        teacherLoading.style.display =
            "none";

    }


    /*
    No records
    */

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


    /*
    Records exist
    */

    if (teacherTable) {

        teacherTable.style.display =
            "table";

    }


    if (noTeachersMessage) {

        noTeachersMessage.style.display =
            "none";

    }


    teachers.forEach(
        function(teacher) {

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


            teacherTableBody.appendChild(row);

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* =====================================================
   ADD / UPDATE TEACHER
===================================================== */

if (teacherForm) {

    teacherForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            clearMessage();


            const id =
                teacherIdInput.value.trim();

            const name =
                teacherNameInput.value.trim();

            const email =
                teacherEmailInput.value.trim();


            /*
            Client-side validation
            */

            if (!name) {

                showMessage(
                    "Please enter the teacher's name.",
                    false
                );

                teacherNameInput.focus();

                return;

            }


            if (!email) {

                showMessage(
                    "Please enter the teacher's email.",
                    false
                );

                teacherEmailInput.focus();

                return;

            }


            const teacherData = {

                name: name,

                email: email

            };


            let url =
                TEACHERS_API_URL;

            let method =
                "POST";


            /*
            If an ID exists, we are editing.
            */

            if (id) {

                url =
                    `${TEACHERS_API_URL}${id}/`;

                method =
                    "PUT";

            }


            console.log(
                `${method} request:`,
                url,
                teacherData
            );


            try {

                teacherSubmitButton.disabled =
                    true;


                teacherSubmitButton.textContent =
                    id
                        ? "Updating..."
                        : "Saving...";


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


                console.log(
                    "Save response status:",
                    response.status
                );


                /*
                Read response safely.
                */

                const responseText =
                    await response.text();


                console.log(
                    "Save response:",
                    responseText
                );


                if (!response.ok) {

                    let errorMessage =
                        "The server rejected the request.";

                    try {

                        const errorData =
                            JSON.parse(
                                responseText
                            );

                        errorMessage =
                            JSON.stringify(
                                errorData
                            );

                    } catch (parseError) {

                        if (responseText) {

                            errorMessage =
                                responseText;

                        }

                    }


                    throw new Error(
                        errorMessage
                    );

                }


                /*
                Successful POST/PUT
                */

                showMessage(
                    id
                        ? "Teacher updated successfully."
                        : "Teacher saved successfully.",
                    true
                );


                resetTeacherForm();


                /*
                Reload directly from the database
                through the API.
                */

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

                teacherSubmitButton.disabled =
                    false;

                teacherSubmitButton.textContent =
                    "Save Teacher";

            }

        }
    );

}


/* =====================================================
   EDIT TEACHER
===================================================== */

function editTeacher(id) {

    const teacher =
        teachers.find(
            function(item) {

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


    teacherIdInput.value =
        teacher.id;

    teacherNameInput.value =
        teacher.name;

    teacherEmailInput.value =
        teacher.email;


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


/* =====================================================
   DELETE TEACHER
===================================================== */

async function deleteTeacher(id) {

    const teacher =
        teachers.find(
            function(item) {

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

        console.log(
            "Deleting teacher:",
            id
        );


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


        console.log(
            "Delete response:",
            response.status
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


/* =====================================================
   RESET FORM
===================================================== */

function resetTeacherForm() {

    if (teacherForm) {

        teacherForm.reset();

    }


    if (teacherIdInput) {

        teacherIdInput.value = "";

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


/* =====================================================
   CANCEL EDIT
===================================================== */

if (cancelTeacherEditButton) {

    cancelTeacherEditButton.addEventListener(
        "click",
        function() {

            resetTeacherForm();

            clearMessage();

        }
    );

}


/* =====================================================
   TABLE BUTTON EVENTS
===================================================== */

if (teacherTableBody) {

    teacherTableBody.addEventListener(
        "click",
        function(event) {

            const target =
                event.target;


            /*
            EDIT BUTTON
            */

            if (
                target.classList.contains(
                    "edit-teacher-button"
                )
            ) {

                const id =
                    target.dataset.id;

                editTeacher(id);

                return;

            }


            /*
            DELETE BUTTON
            */

            if (
                target.classList.contains(
                    "delete-teacher-button"
                )
            ) {

                const id =
                    target.dataset.id;

                deleteTeacher(id);

            }

        }
    );

}


/* =====================================================
   START APPLICATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "Teacher Management initialized."
        );

        loadTeachers();

    }
);