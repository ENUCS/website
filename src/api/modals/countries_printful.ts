/**
 * Single Printful State Option
 * INTERFACE 
*/
export interface State {
    code: string    // State code
    name: string    // State name
}

/**
 * Single Printful Country Option
 * INTERFACE 
*/
export interface Country {
    code: string            // Country code
    name: string            // Country name
    states: Array<State>    // Array of states
}

/**
 * Single Printful ResponseCountryList Option
 * INTERFACE 
*/
export interface responseCountryList {
    code: number                // Response Code Status 
    result: Array<Country>      // Array of Countires
}