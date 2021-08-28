// ~~~~~~~~~~~~~~~~
// BASE API DECLARATIONS
// ~~~~~~~~~~~~~~~~

const fetch = process.browser ? window.fetch : require('node-fetch').default
const base = 'https://api.printful.com'
import { printfulToken } from '../../config/init-printful'

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * This is a SEND METHOD
 * for the ability to be used as a
 * single REQUEST main METHOD
 * to handle all of the requsts for
 * the PRINTFUL API.
 * 
 * @param {*} path 
 * @param {*} opts 
 * @returns 
*/
async function send(path, opts) {
    
    // PRINTFUL Works with FETCH-API - BASIC Authentication - https://stackoverflow.com/questions/43842793/basic-authentication-with-fetch
    opts.headers['Authorization'] = `Basic ${printfulToken}`

    // console.log('checking header opts', opts)

    var promise = Promise.race([
        await fetch(`${base}/${path}`, opts)
            .then(response => {
                // check if the response is OK (200/TRUE)
                if (!response.ok) {
                    // test-dev
                    if (process.env.NODE_ENV != 'production') { console.log('printful.ts', response) } 
                    throw new Error('Network response was not ok')
                } 
                // if no errors are seen, return the data in JSON format
                return response.json()
            })
            .then(json => {
                // console.log('Success:', json);
                return json
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            })
            ,
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

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * This is a POST REQUEST
 * for the use of the PRINTFUL API
 * to obtain the data as a server side
 * request
 * 
 * @param {*} req 
 * @param {*} res
 * @returns
*/
export async function post(req, res) {
    // getting the target endpoint for the data res
    const data = req.body

    // check what method should be used on the PROXY REQUEST;
    let response
    if (data.method == 'GET') {
        response = await send(data.endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } else if (data.method == 'POST') {
        response = await send(data.endpoint, {
            method: 'POST',
            body: JSON.stringify(data.data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    // console.info('Printful.js Response', response) // verifying the response;

    // finalizing the response;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(response))
}