// // Util.js Page for the API Functionality,
// const fetch = process.browser ? window.fetch : require('node-fetch').default;

// /**
//  * Description:
//  * 
//  * 
//  * @param endpoint 
//  * @param data 
//  * @returns 
// */
// export function post(endpoint:string, data:string) {
// 	return fetch(endpoint, {
// 		method: 'POST',
// 		credentials: 'include',
// 		body: JSON.stringify(data),
// 		headers: {
// 			'Content-Type': 'application/json',
// 		}
// 	}).then(r => r.json());
// }