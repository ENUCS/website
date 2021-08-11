// ~~~~~~~~~~~~~~~~
// IMPORTING BASIC
// TOKEN CONFIGS
// ~~~~~~~~~~~~~~~~


import { printfulToken } from '../config/init-printful'


// ~~~~~~~~~~~~~~~~
// BASE API DECLARATIONS
// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
// ~~~~~~~~~~~~~~~~


let base: string
if (process.env.NODE_ENV != 'production') { 
    // base = 'https://cors-anywhere.herokuapp.com/https://api.printful.com'
    base = 'https://api.printful.com'
} else {
    base = 'https://api.printful.com'
}


// ~~~~~~~~~~~~~~~~
// BASE API METHODS
// ~~~~~~~~~~~~~~~~
// ISSUES WITH CORS:
// https://stackoverflow.com/questions/42168773/how-to-resolve-preflight-is-invalid-redirect-or-redirect-is-not-allowed-for
// ~~~~~~~~~~~~~~~~
// More on FETCH-API:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// ~~~~~~~~~~~~~~~~


function send( 
        path: string, 
        opts: {   // declaring fetch-api OPTIONS,
            method: 'GET' | 'POST' | 'PUT' | 'DELETE'           // 'GET' = DEFAULT
            headers?: {
                'Content-Type'?: 'application/json' | 'application/x-www-form-urlencoded' | 'text/plain'
                'Accept'?: 'application/json' | 'text/plain'
                'Origin'?: 'http://192.168.0.10:3000' | 'http://localhost:3000' | 'https://api.printful.com' | ''
                'Authorization'?: `Basic ${typeof printfulToken}`
                'Host'?: 'https://api.printful.com' | 'api.printful.com'
            }
            mode?: 'cors' |  'no-cors' | 'same-origin'          // 'cors' = DEFAULT 
            redirect?: 'follow' | 'manual' | 'error'            // 'follow' = DEFAULT
            credentials?: 'same-origin' | 'include' | 'omit'    // 'same-origin' = DEFAULT
            body?: string                                       // body data type must match "Content-Type" header
        }) 
    {
        
    // declaring fetch-api,
    const fetch = process.browser ? window.fetch : require('node-fetch').default

    // PRINTFUL Works with FETCH-API - BASIC Authentication - https://stackoverflow.com/questions/43842793/basic-authentication-with-fetch
    opts.headers['Authorization'] = `Basic ${printfulToken}`
    
    console.log('opts', opts)

    var promise = Promise.race([
        fetch(`${base}/${path}`, opts)
            .then(response => {
                // check if the response is OK (200/TRUE)
                if (!response.ok) {
                    // test-dev
                    if (process.env.NODE_ENV != 'production') { console.log('printful.ts', response) } 
                    throw new Error('Network response was not ok')
                } 
                // return the data
                return response.json()
            }),
            // .catch(error => {
            //     console.error('There has been a problem with your fetch operation:', error);
            // }),
            new Promise((resolve, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 10000)
            )
        ])
    // execute the fetch-api call
    return promise
}


// ~~~~~~~~~~~~~~~~
// API METHODS ALLOWED
// ~~~~~~~~~~~~~~~~


export function get(path: string) {
    return send(path, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain',
        },
        // mode: 'cors',
        // credentials: 'include',
    })
}


export function post(path: string, data: any) {
    return send(path, {
        method: 'POST',
        body: JSON.stringify(data),
        // credentials: 'include',
        // redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            // 'Accept': 'application/json',
            // 'Origin': 'http://localhost:3000'
        },
    })
}