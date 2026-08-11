"use strict";

/*
=========================================================
SHARED API HELPER
=========================================================
*/


/*
=========================================================
BUILD API URL
=========================================================
*/

function buildApiUrl(endpoint) {

    return `${window.API_BASE_URL}${endpoint}`;

}


/*
=========================================================
GET
=========================================================
*/

async function apiGet(endpoint) {

    const url =
        buildApiUrl(endpoint);

    console.log(
        "API GET:",
        url
    );


    const response =
        await fetch(
            url,
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

        const errorText =
            await response.text();

        throw new Error(
            `GET ${url} failed: ${response.status} ${errorText}`
        );

    }


    return await response.json();

}


/*
=========================================================
GET ARRAY
=========================================================
*/

async function apiGetArray(endpoint) {

    const data =
        await apiGet(endpoint);


    if (Array.isArray(data)) {

        return data;

    }


    if (
        data &&
        Array.isArray(data.results)
    ) {

        return data.results;

    }


    throw new Error(
        `Unexpected API response from ${endpoint}`
    );

}


/*
=========================================================
POST
=========================================================
*/

async function apiPost(
    endpoint,
    data
) {

    const url =
        buildApiUrl(endpoint);

    console.log(
        "API POST:",
        url
    );


    const response =
        await fetch(
            url,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body:
                    JSON.stringify(data)
            }
        );


    const responseText =
        await response.text();


    if (!response.ok) {

        throw new Error(
            `POST ${url} failed: ${response.status} ${responseText}`
        );

    }


    if (!responseText) {

        return null;

    }


    return JSON.parse(
        responseText
    );

}


/*
=========================================================
PUT
=========================================================
*/

async function apiPut(
    endpoint,
    data
) {

    const url =
        buildApiUrl(endpoint);

    console.log(
        "API PUT:",
        url
    );


    const response =
        await fetch(
            url,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body:
                    JSON.stringify(data)
            }
        );


    const responseText =
        await response.text();


    if (!response.ok) {

        throw new Error(
            `PUT ${url} failed: ${response.status} ${responseText}`
        );

    }


    if (!responseText) {

        return null;

    }


    return JSON.parse(
        responseText
    );

}


/*
=========================================================
DELETE
=========================================================
*/

async function apiDelete(
    endpoint
) {

    const url =
        buildApiUrl(endpoint);

    console.log(
        "API DELETE:",
        url
    );


    const response =
        await fetch(
            url,
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
            `DELETE ${url} failed: ${response.status} ${errorText}`
        );

    }


    return true;

}