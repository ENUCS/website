// NEW TOKEN
// GET NEW TOKEN FROM PRINTFUL, ENCODE IT and ADD IT HERE, USING BASE64 Encoding;
// https://www.base64encode.org/

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