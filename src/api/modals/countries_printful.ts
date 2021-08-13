/**
 * Data Interface for the API
 * in the Orders API for Printful
 * ------
 * https://www.printful.com/es/docs/countries 
*/

export interface State {
    code: string    // State code
    name: string    // State name
}

export interface Country {
    code: string            // Country code
    name: string            // Country name
    states: Array<State>    // Array of states
}

export interface responseCountryList {
    code: number                // Response Code Status 
    result: Array<Country>      // Array of Countires
}