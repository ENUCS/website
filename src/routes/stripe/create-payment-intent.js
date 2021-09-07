// ~~~~~~~~~~~~~~~~
// BASE API DECLARATIONS
// ~~~~~~~~~~~~~~~~
import { stripeTokenPriv } from '../../config/tokens'
const stripe = require("stripe")(stripeTokenPriv)

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * Calculate the amount due to be paid
 * by the user to correctly
 * charge the correct amount
 * 
 * @param {*} items 
 * @returns (PRICE TO CHARGE)
*/
const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client

    // get the amountToPay,
    let amount = items.amountToPay * 100
    console.log('amount', amount)
    // & return it;
    return amount
};

// unknonw
const chargeCustomer = async (customerId) => {
    // Lookup the payment methods available for the customer
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card"
    });
    // Charge the customer and payment method immediately
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: "usd",
        customer: customerId,
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true
    });
    if (paymentIntent.status === "succeeded") {
        console.log("✅ Successfully charged card off session");
    }
}


/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * A Stripe Payment Intent
 * - Create a PaymentIntent -
 *  
 * @param {*} req 
 * @param {*} res 
 */
export async function post(req, res) {
    // extract the data from the POST, body;
    const {
        items
    } = req.body;

    // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
    // and attach the PaymentMethod to a new Customer
    const customer = await stripe.customers.create();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        customer: customer.id,
        setup_future_usage: 'off_session',
        amount: calculateOrderAmount(items),
        currency: items.currenyPay
    })

    // return the client_secret to process the transaction
    res.send({
        clientSecret: paymentIntent.client_secret
    })
}