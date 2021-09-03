require("dotenv").config();

// NEW TOKEN
// GET NEW TOKEN FROM PRINTFUL, ENCODE IT and ADD IT HERE:
// https://www.base64encode.org/

// exporting the printfulToken in a base64 encoded format;
// when using process.env.PRINTFUL_TOKEN, it does not work...
export const printfulToken = process.env.PRINTFUL_API_TOKEN

// stripte TEST Tokens 
// (Private & Public);
export const stripeTokenPriv = process.env.STRIPE_API_PRIVATE_TOKEN
export const stripeTokenPub = process.env.STRIPE_API_PUBLIC_TOKEN