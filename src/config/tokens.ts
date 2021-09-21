// NEW TOKEN
// GET NEW TOKEN FROM PRINTFUL, ENCODE IT and ADD IT HERE, USING BASE64 Encoding;
// https://www.base64encode.org/

// ISSUES WITH SAPPER AND DOT-ENV
// https://github.com/sveltejs/sapper/issues/122
// SOLUTION: https://github.com/JpCapdevila/sapper-environment
// OR ALTERNATIVE: https://github.com/svelte-brasil/sapper-boilerplate-stylus-env-axios/blob/master/rollup.config.js

// ~~~~~~~~~~~~~~~~~~~~~~~~
// PRINTFUL API KEYS - TOKENS
export const printfulToken = process.env.SAPPER_APP_PRINTFUL_API_TOKEN

// ~~~~~~~~~~~~~~~~~~~~~~~~
// STRIPE API KEYS - TOKENS
export let stripeTokenPriv
export let stripeTokenPub

if (process.env.NODE_ENV == 'production') {
    stripeTokenPub = process.env.SAPPER_APP_STRIPE_API_PUBLIC_TOKEN_LIVE
    stripeTokenPriv = process.env.SAPPER_APP_STRIPE_API_PRIVATE_TOKEN_LIVE
} else {
    stripeTokenPub = process.env.SAPPER_APP_STRIPE_API_PUBLIC_TOKEN_DEV
    stripeTokenPriv = process.env.SAPPER_APP_STRIPE_API_PRIVATE_TOKEN_DEV
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
// EMAIL APP CREDENTIALS - TOKENS
export const email = process.env.SAPPER_APP_EMAIL
export const emailAppPassword = process.env.SAPPER_APP_EMAIL_APP_PASSWORD