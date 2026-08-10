"use strict";

/*
============================================================
SCHOOL MANAGEMENT SYSTEM
FRONTEND API CONFIGURATION
============================================================

LOCAL DEVELOPMENT
-----------------
Django serves the frontend and backend:

http://127.0.0.1:8000

PRODUCTION
----------
Vercel serves the frontend.

Render serves the Django REST API.
============================================================
*/


const API_BASE_URL =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"

        ? ""

        : "https://school-management-backend-igpt.onrender.com";


/*
============================================================
API ENDPOINTS
============================================================
*/

const API = {

    students:
        `${API_BASE_URL}/api/students/`,

    teachers:
        `${API_BASE_URL}/api/teachers/`,

    subjects:
        `${API_BASE_URL}/api/subjects/`,

    marks:
        `${API_BASE_URL}/api/marks/`,

    attendance:
        `${API_BASE_URL}/api/attendance/`

};


/*
============================================================
BUILD API URL
============================================================

Example:

apiUrl(API.students, 5)

returns:

Local:
    /api/students/5/

Production:
    https://school-management-backend-igpt.onrender.com/api/students/5/
============================================================
*/

function apiUrl(endpoint, id = null) {

    if (id === null || id === undefined) {
        return endpoint;
    }

    return `${endpoint}${id}/`;
}