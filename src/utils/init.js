/**
 * Util.js Page for the API Functionality,
*/

// declaring the use of FETCH-API;
const fetch = process.browser ? window.fetch : require('node-fetch').default;

/**
 * Function POST
 * Used as a PROXY on the website
 * to handle requests correctly and
 * in-line with the CORS requirements.
 * 
 * A POST request is used to appropietly
 * pass data from the client-to-the-backend.
 * 
 * @param {*} path 
 * @param {*} data 
 * @returns 
*/
export async function post(path, data) {
    return await fetch(path, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(r => r.json())
}