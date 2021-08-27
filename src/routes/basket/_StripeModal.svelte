<!-- 
~~~~~~~~~~~~~~~~~~~
Developed with the help and use of:
https://stackoverflow.com/questions/62723869/stripe-elements-card-mount-function-error-after-svelte-onmount-fires
~~~~~~~~~~~~~~~~~~~
-->

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { post } from '../../utils/init.js'
    import { loadStripe } from '@stripe/stripe-js'
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher()

    export let data
    const { name, email } = data

    let stripe = null
    let card = null
    let secret = null
    let processing: boolean = false
    let executing: boolean = false
    let error: boolean = false
    let success: boolean = false
    let thankYou: boolean = false

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Initiates the Stripe-API
     * in accordance to SvelteJs quirks & tricks
    */
    onMount(async () => {
        // Make sure to call loadStripe outside of a component’s render to avoid
        // recreating the Stripe object on every render.
        // loadStripe is initialized with your real test publishable API key.
        stripe = await loadStripe("pk_test_51JKygiIyAXMjFyvNqb2J6x3Z95NbF7lRjrKf4uAIRNYDx6SG0kMsLJcSYEl8iLYVT4tCMnXTeUo4rPGIw8WkosjI00fc8PDjEA")

        // mount the card to the dom
        var elements = await stripe.elements()
        card = await elements.create('card')
        card.mount("#card-element")

        // get the Stripe-Secret to make the Payment; [JSON-RETURN]
        secret = await post(`stripe/create-payment-intent`, { 
            items: data 
        })
    })

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Submit Function that handles the 
     * payments for the submission
     * of the Stripe Form
    */
    async function handlePayment() {
        // code to charge the card. Call
        executing = true

        // now that you mounted the stripe credit card Elment. Collect credit
        // card details and submit it to stripe to process the payment using
        // their api confirmCardPayment
        stripe.confirmCardPayment(secret.clientSecret, {
            receipt_email: email,
            payment_method: {
                // the stripe card element has the credit card data
                card: card,
                billing_details: {
                    name: name
                }
            }
        }).then(function(result) {
            executing = false
            processing = true
            setTimeout(async() => {
                if (result.error) {
                    console.log('Uh-oh... there was an error with the payment', result.error.message);
                    error = true
                    setTimeout(async() => {
                        error = false
                        processing = false
                        closeStripe()
                    }, 3500)
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        // update db, send emails to customer and admin...etc
                        console.log('Payment was processed successfully!');
                        success = true
                        setTimeout(async() => {
                            thankYou = true
                            setTimeout(async() => {
                                processing = false
                                success = false
                                thankYou = false
                                dispatch('success')
                            }, 5000)
                        }, 3500)
                    }
                }
            }, 3500)
        });
    }

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * A component event trigger
     * that triggers in the PARENT
     * component an event; in this case
     * the event `on:close`.
    */
	function closeStripe() {
		dispatch('close')
	}
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

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
        width: calc(100vw / (var(--mobile) / 90));
        height: calc(100vw / (var(--mobile) / 37.45));
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
        padding: calc(100vw / (var(--mobile) / 50)) calc(100vw / (var(--mobile) / 27)) calc(100vw / (var(--mobile) / 70)) calc(100vw / (var(--mobile) / 27));
        background-color: #ffffff;
        display: flex;
        align-content: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
    .image-stripe-state {
        width: calc(100vw / (var(--mobile) / 44));
        height: calc(100vw / (var(--mobile) / 44));
    }
    /* 
     */
    form {
        
    }
    label[for='card-details'] {
        margin-bottom: calc(100vw / (var(--mobile) / 14));
    }

    #card-element {
        border-radius: 4px 4px 0 0;
        padding: 12px;
        border: 1px solid rgba(50, 50, 93, 0.1);
        max-height: 44px;
        width: 100%;
        background: white;
        box-sizing: border-box;
        width: calc(100vw / (var(--mobile) / 273.03));
    }

    /* 
    buttons and links */
    button {
        background: #2A2F45;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 6.37931px;
        margin-top: 22px;
        width: 100%;
        width: calc(100vw / (var(--mobile) / 273.03));
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
    /* 
     */
    #redirect-hint {
        position: absolute;
        bottom: 5%;
        /* width: 250px; */
    } #redirect-hint p {
        margin-left: calc(100vw / (var(--mobile) / 11));
    }

    #execute-pay-btn {
        position: relative;
    }
    #executing-error-msg-box {
        position: absolute;
        top: 130%;
        right: 0;
        left: 0;
    }

    /* 
    ~~~~~~~~~~~~~~~~~~~~
        TABLET FIRST 
        767px is used to allow for 
        IPad to use the Tablet Version
    */
    @media only screen and (min-width: 767px) {

        #stripe-logo {
            width: calc(100vw / (var(--tablet) / 90));
            height: calc(100vw / (var(--tablet) / 37.45));
            margin-bottom: calc(100vw / (var(--tablet) / 47.55));
        }
        #form-modal {
            /* 
            */
            width: calc(100vw / (var(--tablet) / 328));
            height: calc(100vw / (var(--tablet) / 282));
            padding: calc(100vw / (var(--tablet) / 15)) calc(100vw / (var(--tablet) / 27)) calc(100vw / (var(--tablet) / 27)) calc(100vw / (var(--tablet) / 27));
        }
        #close-stripe-modal {
            right: calc(100vw / (var(--tablet) / 15));
            top: calc(100vw / (var(--tablet) / 15));
        }
        .image-stripe-state {
            width: calc(100vw / (var(--tablet) / 44));
            height: calc(100vw / (var(--tablet) / 44));
            margin-bottom: calc(100vw / (var(--tablet) / 12));
        }
        /* 
        */
        form {
            
        }
        label[for='card-details'] {
            margin-bottom: calc(100vw / (var(--tablet) / 14));
        }

        #card-element {
            border-radius: 4px 4px 0 0;
            padding: calc(100vw / (var(--tablet) / 12));
            border: calc(100vw / (var(--tablet) / 1)) solid rgba(50, 50, 93, 0.1);
            max-height: calc(100vw / (var(--tablet) / 44));
            width: 100%;
            background: white;
            box-sizing: border-box;
            width: calc(100vw / (var(--tablet) / 273.03));
        }

        /* 
        buttons and links */
        button {
            background: #2A2F45;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 6.37931px;
            margin-top: calc(100vw / (var(--tablet) / 22));
            width: 100%;
            width: calc(100vw / (var(--tablet) / 273.03));
        }
        /* 
        */
        #redirect-hint {
            margin-top: calc(100vw / (var(--tablet) / 23));
        } #redirect-hint p {
            margin-left: calc(100vw / (var(--tablet) / 11));
        }
    }

    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST
        1025px is used to allow for IPad 
        Pro to use the Tablet Version
    */
    @media only screen and (min-width: 1025px) {
        
        #stripe-logo {
            width: calc(100vw / (var(--desktop) / 90));
            height: calc(100vw / (var(--desktop) / 37.45));
            margin-bottom: calc(100vw / (var(--desktop) / 47.55));
        }
        #form-modal {
            /* 
            */
            width: calc(100vw / (var(--desktop) / 328));
            height: calc(100vw / (var(--desktop) / 282));
            padding: calc(100vw / (var(--desktop) / 15)) calc(100vw / (var(--desktop) / 27)) calc(100vw / (var(--desktop) / 27)) calc(100vw / (var(--desktop) / 27));
        }
        #close-stripe-modal {
            right: calc(100vw / (var(--desktop) / 15));
            top: calc(100vw / (var(--desktop) / 15));
        }
        .image-stripe-state {
            width: calc(100vw / (var(--desktop) / 44));
            height: calc(100vw / (var(--desktop) / 44));
            margin-bottom: calc(100vw / (var(--desktop) / 12));
        }
        /* 
        */
        form {
            
        }
        label[for='card-details'] {
            margin-bottom: calc(100vw / (var(--desktop) / 14));
        }

        #card-element {
            border-radius: 4px 4px 0 0;
            padding: calc(100vw / (var(--desktop) / 12));
            border: calc(100vw / (var(--desktop) / 1)) solid rgba(50, 50, 93, 0.1);
            max-height: calc(100vw / (var(--desktop) / 44));
            width: 100%;
            background: white;
            box-sizing: border-box;
            width: calc(100vw / (var(--desktop) / 273.03));
        }

        /* 
        buttons and links */
        button {
            background: #2A2F45;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 6.37931px;
            margin-top: calc(100vw / (var(--desktop) / 22));
            width: 100%;
            width: calc(100vw / (var(--desktop) / 273.03));
        }
        /* 
        */
        #redirect-hint {
            margin-top: calc(100vw / (var(--desktop) / 23));
        } #redirect-hint p {
            margin-left: calc(100vw / (var(--desktop) / 11));
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

<div id='background-modal-blur' in:fade />

<div id='form-modal' in:fade>
    <!--
    ~~~~~~~~~~~~~~~~~
    stripe-logo-image -->
    <img
        id='stripe-logo'
        class='m-b-20'
        src="./assets/svg/icons/stripe-vector.svg" 
        alt="stripe-logo"
    />
    <!-- 
    ~~~~~~~~~~~~~~~~~
    rendering different states of 
    the webiste for Stripe API -->
    {#if !processing}
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
            <p class='s-10 color-secondary bold'>close</p>
        </div>
        <!-- 
        ~~~~~~~~~~~~~~~~~
        form-card-details -->
        <form on:submit|preventDefault={handlePayment}>
            <label for="card-details">
                <p class='s-16 m-b-5 bold'>
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
            submit payment button & click-response action -->
            <div id='execute-pay-btn'>
                <button id="submit" disabled={executing}>
                    <p class='s-16 bold'>
                        Pay {data.amountToPay} {data.currenyPay}
                    </p>  
                </button>
                <!--
                ~~~~~~~~~~~~~~~~~
                executing message text -->
                {#if executing}
                    <div id='executing-error-msg-box' 
                        class='row-space-center'
                        in:fade
                        >
                        <img 
                            class='m-r-10'
                            src='./assets/svg/stripe-loading-group-animated.svg'
                            alt=''
                            width="14px"
                        />
                        <p class='s-12 color-red bold'>
                            executing...
                        </p>
                    </div>
                {/if}
            </div>
        </form>

    {:else if processing && success}
        <img
            class='image-stripe-state m-b-10'
            src="./assets/svg/check-vector.svg" 
            alt="stripe-logo" in:fade
        />
        <p class="s-16 bold color-success" in:fade>Success!</p>
        <p class="s-14 cold color-secondary" in:fade>Your order has been placed</p>

        {#if thankYou}
            <div id='redirect-hint' 
                class='row-space-center'
                in:fade>
                <img
                    src="./assets/svg/arrow-vector.svg" 
                    alt="back-arrow"
                />
                <p class="s-12 color-secondary">
                    <span class='bold'>you are being redirected</span> 
                    <br />
                    to the main 
                    <span class='bold'>/shop</span> 
                    page
                </p>
            </div>
        {/if}

    {:else if processing && error}
        <img
            class='image-stripe-state m-b-10'
            src="./assets/svg/error-vector.svg" 
            alt="error-icon"
            in:fade
        />
        <p class="s-16 bold color-error" in:fade>Uh-oh!</p>
        <p class="s-14" in:fade>There was an error with your payment</p>

    {:else if processing}
        <img
            class='image-stripe-state m-b-10'
            src="./assets/svg/Group-animated.svg" 
            alt="processing-load"
            in:fade
        />
        <p class="s-16 bold color-blue-green-gradient" in:fade>Processing Payment</p>
        <p class="s-14" in:fade>hold on, your payment is being processed</p>
    {/if}
</div>