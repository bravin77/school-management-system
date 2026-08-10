"use strict";

/*
 * ============================================================
 * SCHOOL MANAGEMENT SYSTEM
 * Frontend API Configuration
 * ============================================================
 *
 * LOCAL DEVELOPMENT:
 *
 * Django serves both frontend and backend:
 *
 * http://127.0.0.1:8000
 *
 *
 * PRODUCTION:
 *
 * Vercel serves the frontend.
 * Render serves the Django REST API.
 *
 * Example:
 *
 * https://school-management-system.onrender.com
 *
 * We will replace the production URL after Render
 * gives us the actual URL.
 * ============================================================
 */


const API_BASE_URL =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"

        ? ""

        : "https://YOUR-RENDER-BACKEND.onrender.com";


/*
 * ============================================================
 * API ENDPOINTS
 * ============================================================
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
 * ============================================================
 * HELPER FUNCTION
 * ============================================================
 *
 * Use this when a JavaScript file needs to construct
 * an endpoint from an ID.
 *
 * Example:
 *
 * apiUrl(API.marks, 5)
 *
 * produces:
 *
 * /api/marks/5/
 *
 * locally, or:
 *
 * https://your-render-url.onrender.com/api/marks/5/
 *
 * in production.
 * ============================================================
 */

function apiUrl(endpoint, id = null) {

    if (id === null || id === undefined) {

        return endpoint;

    }

    return `${endpoint}${id}/`;

}