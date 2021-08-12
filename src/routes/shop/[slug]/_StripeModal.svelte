<!-- 
~~~~~~~~~~~~~~~~~~~
Developed with the help and use of:
https://stackoverflow.com/questions/62723869/stripe-elements-card-mount-function-error-after-svelte-onmount-fires
~~~~~~~~~~~~~~~~~~~
-->

<!-- 
~~~~~~~~~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~~~~~~~~~
-->
<script lang='ts'>

    import { post } from '../../../utils/init.js'
    import { loadStripe } from '@stripe/stripe-js'
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

    export let data

    let stripe = null;
    let card = null;
    let secret = null;

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
    */
    onMount(async () => {
        // Make sure to call loadStripe outside of a component’s render to avoid
        // recreating the Stripe object on every render.
        // loadStripe is initialized with your real test publishable API key.
        stripe = await loadStripe("pk_test_51JKygiIyAXMjFyvNqb2J6x3Z95NbF7lRjrKf4uAIRNYDx6SG0kMsLJcSYEl8iLYVT4tCMnXTeUo4rPGIw8WkosjI00fc8PDjEA");

        // mount the card to the dom;
        var elements = await stripe.elements();
        card = await elements.create('card');
        card.mount("#card-element")

        // get the Stripe-Secret to make the Payment; [JSON-RETURN]
        secret = await post(`stripe/create-payment-intent`, { 
            items: data 
        })
    });

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
    */
    async function handlePayment() {
        // code to charge the card. Call

        // now that you mounted the stripe credit card Elment. Collect credit
        // card details and submit it to stripe to process the payment using
        // their api confirmCardPayment
        stripe.confirmCardPayment(secret.clientSecret, {
            payment_method: {
                // the stripe card element has the credit card data
                card: card,
                billing_details: {
                    name: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'
                }
            }
        }).then(function(result) {
            if (result.error) {
                console.log(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // update db, send emails to customer and admin...etc
                    console.log('Success!');
                    closeStripe()
                }
            }
        });
    }


    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * A component event trigger
     * that triggers in the parent
     * component an event; in this case
     * the event `on:close`.
    */
	function closeStripe() {
		dispatch('close')
	}
</script>

<!-- 
~~~~~~~~~~~~~~~~~~~~
    COMPONENT STYLE
~~~~~~~~~~~~~~~~~~~~
-->

<style>
    #background-modal-blur {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 4;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }
    #stripe-logo {
        margin-bottom: calc(100vw / (var(--mobile) / 27));
    }
    #form-modal {
        /* 
         */
        width: calc(100vw / (var(--mobile) / 328));
        height: calc(100vw / (var(--mobile) / 282));
        /* 
         */
        position: fixed;
        right: 0;
        left: 0;
        margin: auto;
        top: 0;
        bottom: 0;
        z-index: 5;
        box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
            0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
        border-radius: 3.82px;
        padding: 27px;
        background-color: #ffffff;
    }
    #close-stripe-modal {
        position: absolute;
        right: 15px;
        top: 15px;
        display: grid;
        justify-content: center;
        align-content: center;
        justify-items: center;
    }
    /* 
     */
    form {
        
    }

    input {
        border-radius: 6px;
        margin-bottom: 6px;
        padding: 12px;
        border: 1px solid rgba(50, 50, 93, 0.1);
        max-height: 44px;
        font-size: 16px;
        width: 100%;
        background: white;
        box-sizing: border-box;
    }

    .result-message {
    line-height: 22px;
    font-size: 16px;
    }

    .result-message a {
    color: rgb(89, 111, 214);
    font-weight: 600;
    text-decoration: none;
    }

    .hidden {
    display: none;
    }

    #card-error {
    color: rgb(105, 115, 134);
    font-size: 16px;
    line-height: 20px;
    margin-top: 12px;
    text-align: center;
    }

    #card-element {
    border-radius: 4px 4px 0 0;
    padding: 12px;
    border: 1px solid rgba(50, 50, 93, 0.1);
    max-height: 44px;
    width: 100%;
    background: white;
    box-sizing: border-box;
    }

    #payment-request-button {
    margin-bottom: 32px;
    }

    /* 
    buttons and links */
    button {
        background: #2A2F45;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 6.37931px;
        margin-top: 22px;
        width: 100%;
    }
    button p {
        color: #ffffff;
    }
    button:hover {
        filter: contrast(115%);
    }
    button:disabled {
        opacity: 0.5;
        cursor: default;
    }

    /* spinner/processing state, errors */
    .spinner,
    .spinner:before,
    .spinner:after {
    border-radius: 50%;
    }

    .spinner {
    color: #ffffff;
    font-size: 22px;
    text-indent: -99999px;
    margin: 0px auto;
    position: relative;
    width: 20px;
    height: 20px;
    box-shadow: inset 0 0 0 2px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    }

    .spinner:before,
    .spinner:after {
    position: absolute;
    content: "";
    }

    .spinner:before {
    width: 10.4px;
    height: 20.4px;
    background: #5469d4;
    border-radius: 20.4px 0 0 20.4px;
    top: -0.2px;
    left: -0.2px;
    -webkit-transform-origin: 10.4px 10.2px;
    transform-origin: 10.4px 10.2px;
    -webkit-animation: loading 2s infinite ease 1.5s;
    animation: loading 2s infinite ease 1.5s;
    }

    .spinner:after {
    width: 10.4px;
    height: 10.2px;
    background: #5469d4;
    border-radius: 0 10.2px 10.2px 0;
    top: -0.1px;
    left: 10.2px;
    -webkit-transform-origin: 0px 10.2px;
    transform-origin: 0px 10.2px;
    -webkit-animation: loading 2s infinite ease;
    animation: loading 2s infinite ease;
    }

    @keyframes loading {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
    }

</style>

<!-- 
~~~~~~~~~~~~~~~~~~~~
	COMPONENT HTML
~~~~~~~~~~~~~~~~~~~~
-->
<div id='background-modal-blur'></div>

<div id='form-modal'>
    <!--
    ~~~~~~~~~~~~~~~~~
    stripe-logo-image -->
    <img
        id='stripe-logo'
        src="./assets/svg/icons/stripe-vector.svg" 
        alt="stripe-logo"
    />
    <!-- 
    ~~~~~~~~~~~~~~~~~
    close-stripe-container -->
    <div 
        id='close-stripe-modal'
        on:click={closeStripe}>
        <img 
            src="./assets/svg/icons/close-vector.svg" 
            alt="close-icon"
        />
        <p>close</p>
    </div>
    <!-- 
    ~~~~~~~~~~~~~~~~~
    form-card-details -->
    <form on:submit|preventDefault={handlePayment}>
        <label for="card-details">
            <p class='s-16 bold'>
                Card Details
            </p>
        </label>
        <div id="card-element" name='card-details'>
            <!-- Elements will create input elements here -->
        </div>
        <!-- 
        ~~~~~~~~~~~~~~~~~
        We'll put the error messages in this element -->
        <div id="card-errors" role="alert">

        </div>
        <!--
        ~~~~~~~~~~~~~~~~~
        submit payment button -->
        <button id="submit">
            <p class='s-16'>
                Pay {data.currenyPay} {data.amountToPay}
            </p>  
        </button>
    </form>
</div>