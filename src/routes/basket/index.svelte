<!-- ===================
	COMPONENT JS - MODULE 
    [TypeScript Written]
=================== -->

<script context="module" lang='ts'>
    import { post } from '../../utils/init.js'
    import type { Preload } from "@sapper/common"

    /**
     * Descrption:
     * ~~~~~~~~~~~~~~~~~~~~
     * This function / method preloads
     * with the loading of the web-page
     * with the use of <a rel='prefetch' ... > </a>
     * 
     * @param this
     * @param param1
    */
    export const preload: Preload = async function (this, { host, params}) {

        // get the page `http(s)://[domain-route] to comply with 
        // project strict CORS on Pre-loads
        let protocol: string
        if (process.env.NODE_ENV != 'production') {
            protocol = 'http://'
        } else {
            protocol = 'https://'
        }

        // get the list of `ship-to` countries by Printful-API, used to identify and populate
        // the `shipping-country & state-codes input dropdown fields;
        const resCountriesList = await post(`${protocol}${host}/shop/printful`, {
            method: 'GET',
            endpoint: `countries`,
        })

        // return these pieces of data as `export let ...`
        return {
            resCountriesList
        }
    }
</script>

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { goto } from '@sapper/app';
    import { fade } from 'svelte/transition';

    import { cart } from "../../stores/basket.js";

    import type { SyncVariant, responseListProductVariants } from '../../models/printful/proucts_printful'
    import type { UserAddress, RequestEsimateOrderCosts, ResponseEstimateOrderCosts, NewOrder, Item } from '../../models/printful/orders_printful'
    import type { responseCountryList } from '../../models/printful/countries_printful'
    import type { ItemInfo, UserAddressInfo, ShippingInfo, RequestShippingRates, ResponseShippingRates } from '../../models/printful/shipping-rates-printful'

    import StripeModal from './_StripeModal.svelte'
    import BasketItemCard from './_BasketItemCard.svelte'

    import OrderCostLoader from './_OrderCostLoader.svelte'
    import ShippingLoader from './_ShippingLoader.svelte'

    import type { ContentLoaderProps } from '../../models/content-loader-interface'

    /**
     * Decalring the ContentLoaderProps
     * values through the interface 
    */
    let contentLoaderProps_1: ContentLoaderProps = {
        width: `100%`,
        height: `75`,
        primaryColor: '#f9f9f9'
    }
    let contentLoaderProps_2: ContentLoaderProps = {
        width: `100%`,
        height: `160`,
        primaryColor: '#f9f9f9'
    }

    // data gathered from the PRE-LOAD SvelteJs Method;
    export let resCountriesList: responseCountryList

    // sort country list in alphabetical order;
    resCountriesList.result = resCountriesList.result.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

    // breaking down the cart-items info;
    let orderItemsData: Array < any > = []
    let cartItems: Array < SyncVariant >
    let cartQuantity: number 
    let cartCost: number

    // SvelteJS Reactive Variables;
    $: cartItems = $cart.cartItems
    $: cartQuantity = $cart.cartItemsQty
    $: cartCost = $cart.cartItems.reduce((accumulator, item) => accumulator + (parseInt(item.retail_price) * item.quantity), 0);
    // stip away unecessary order Item info, and create a simpler one;
    $: for (let variant of cartItems) { 
        orderItemsData.push({
            sync_variant_id: variant.id,
            quantity: variant.quantity
        })
    }

    // initiaiting component-page `Promises`;
    let promise: Promise < ResponseEstimateOrderCosts >
    let promiseShipCosts: Promise < ResponseShippingRates >


    // a dynamic binding Object for UserAddress;
    let recipient: UserAddress = { 
        name: undefined,
        address1: undefined,
        zip: undefined,
        email: undefined,
        city: undefined,
        state_code: undefined,
        country_code: undefined,
    }

    // contains the selected shipping-type-option;
    let shipPrice: ShippingInfo = undefined 

    // (Order API) a dynamic binding Object for NewOrder;
    // [SvelteJS - Reactivity] declaring the final INTERFACE for NewOrder
    let newOrder: NewOrder 
    $: newOrder = { 
        recipient: recipient,
        items: cartItems as Array< Item >
    }

    let getTotalCosts: boolean = false  // boolean rendering of the `total order costs` section
    let getShipRates: boolean = false   // boolean rendering of the `shippment rates` section

    /**
     * Description:
     * ~~~~~~~~~~~
     * Checks if all form fields have been filled
     * with appropiate input, trigerring `async API` 
     * requests to the `Printful API` to obtain 
     * `estimate-order-costs` and `shipping-rates`
     * data respectively. Otherwise, `hides` sections,
     * missing `form input` fields data input
    */
    $: if (
        cartQuantity != 0 &&
        recipient.name != undefined && recipient.name != '' &&
        recipient.address1 != undefined && recipient.address1 != '' &&
        recipient.city != undefined && recipient.city != '' &&
        recipient.country_code != undefined && recipient.country_code != '' &&
        recipient.email != undefined && recipient.email != '' &&
        recipient.state_code != undefined &&
        recipient.zip != undefined && recipient.zip != '') {

        // fill in required fields for calc. shipping-cost,
        let newShippingRate: RequestShippingRates = {
            recipient: <UserAddress> recipient,
            items: newOrder.items as unknown as Array < ItemInfo >
        }
        // calculate an estiamate for order-costs & expenses;
        promise = estimateOrderCosts(newOrder)
        getTotalCosts = true // show - render the order costs container

        // calculate shipping-rates and the shipping-type;
        promiseShipCosts = getShippingRates(newShippingRate)
        getShipRates = true // show - render the shipping field

    } else {
        getTotalCosts = false // hide the order costs container
        getShipRates = false  // hide the shipping field
    }

    /**
     * Description:
     * ~~~~~~~~~~~
     * Declaring the Stripe INTERFACE for Payment Processing
     * and simultanously instantiating the data for each field
    */
    let stripeData: {
        name: string
        email: string
        amountToPay: number
        currenyPay: string
    } = {
        name: undefined,
        email: undefined,
        amountToPay: undefined,
        currenyPay: undefined
    }
    $: stripeData.name = recipient.name
    $: stripeData.email = recipient.email

    /**
     * Description:
     * ~~~~~~~~~~~
     * Estimate Order Costs for the user dynamically. This
     * function makes a async/dynamic request to the Printful-API
     * to estiamte order costs, taxes, printful costs...etc.
    */
    async function estimateOrderCosts(data: any): Promise < ResponseEstimateOrderCosts > {
        const _data = {
            method: 'POST',
            endpoint: `orders/estimate-costs`,
            data: data
        }
        const response = await post(`shop/printful`, _data)
        // console.info('response', response) // test-response
        // itercept key data elements and store in the JS;
        stripeData.amountToPay = parseInt(response.result.retail_costs.total) + parseInt(response.result.costs.vat)
        stripeData.currenyPay = response.result.retail_costs.currency
        // return the estimateOrderCost Response;
        return response
    }

    /**
     * listen to when `shipPrice` contains `shippment-data`,
     * to include the `shipping pirce part of the `user-to-pay` bill
    */ 
    $: if (shipPrice != undefined) {
        stripeData.amountToPay += parseInt(shipPrice.rate)
    }

    /**
     * Description:
     * ~~~~~~~~~~~
     * Obtain - as a Promise <> containing data for
     * Shipping Rates, Ship Options, Shippment Speed
    */
    async function getShippingRates(data: any): Promise < ResponseShippingRates > {
        // declare the data to be passed to the back-server;
        const _data = {
            method: 'POST',
            endpoint: `shipping/rates`,
            data: data
        }
        // initiate the response;
        const response = await post(`shop/printful`, _data)
        // reset the shipPrice value;
        shipPrice = undefined
        // return the Promise < ResponseShippingRates >;
        return response
    }

    /**
     * Description:
     * ~~~~~~~~~~~
     * Checks that the country field
     * has been selected and checks
     * if there are any StateCodes avaialble
     * as a response from Printful API.
     * 
     * Hide / Show StateCode Field respectively.
    */
    let stateCodeArray: boolean = false;

    function getStateCodes() {
        // loop-thorough all of the countries list and identify the selected target country;
        for (let element of resCountriesList.result) {
            // if country code matches the selected, check if it has any state codes;
            if (element.code == recipient.country_code && element.states != null) {
                stateCodeArray = true // display the statecode field
                recipient.state_code = undefined // re-set the `state-code` field value
                clearLocation() // clear all the other `location-geo` information
                return;
            }
        }
        stateCodeArray = false // else keep the statecode field hidden;
        recipient.state_code = '' // place the state-code values as NOT undefined, but rather empty to pass the check
        clearLocation() // clear other field options
    }

    /**
     * Description:
     * ~~~~~~~~~~~
     * Re-set `form` and further `order-breakdown`
     * information, when `country or location`
     * input fields change values
    */
    function clearLocation() {
        // ~~~~~~~~~~~~~~~~~
        // re-set the recipient form data
        recipient.city = undefined
        recipient.zip = undefined
        // ~~~~~~~~~~~~~~~~~
        // re-set the recipient ship data
        shipPrice = undefined
    }

    /**
     * Description:
     * ~~~~~~~~~~~
     * Closes / Opens the Stripe Modal
     * Triggered as an `EventDispatch` by the 
     * `StripeModal Component`
    */
    let showStripe: boolean = false

    function closeStripe() {
        showStripe = false;
    }

    function startStripe() {
        // ~~~~~~~~~~~~~~~~~
        // check if basket is not empty,
        if (cartQuantity == 0) {
            alert('uh-oh! you cannot checkout as your basket is empty')
            return
        }
        // ~~~~~~~~~~~~~~~~~
        // check if `shipment-type` has been selected,
        else if (shipPrice == undefined) {
            alert('uh-oh! you need to pick a delivery method')
            return
        }
        // ~~~~~~~~~~~~~~~~~
        // if all is good, load stripe and proceed to checkout
        showStripe = true;
    }

    /**
     * Description:
     * ~~~~~~~~~~~
     * Porcess the Printful Order and 
     * Submit it for Review (Not Instantly Accepted)
    */
    async function processPrintfulOrder() {
        // ~~~~~~~~~~~~~~~~~
        // close stripe modal,
        showStripe = false
        // ~~~~~~~~~~~~~~~~~
        // clone the itmes `orderData`, to prevet SvelteJs triggering a reactive response (`$:`)
        let finalOrderCreate: NewOrder = newOrder
        // ~~~~~~~~~~~~~~~~~
        // assign the shipping type option to the order,
        // and the `simpler` version of the `placeOrder API` body format
        finalOrderCreate.shipping = shipPrice.id
        finalOrderCreate.items = orderItemsData
        // ~~~~~~~~~~~~~~~~~
        // construct the data for the `order confirmation`
        const _data = {
            method: 'POST',
            endpoint: `orders`,
            data: finalOrderCreate
        }
        // ~~~~~~~~~~~~~~~~~
        // pass the response to printful API for placing the order;
        const response = await post(`shop/printful`, _data)
        // ~~~~~~~~~~~~~~~~~
        // delete users basket;
        clearBasket()
        // ~~~~~~~~~~~~~~~~~
        // redirect user back to the `shop` page;
        goto('/shop')
    }

    /**
     * Description:
     * ~~~~~~~~~~~
     * Clear user basket (hard-delete)
    */
    function clearBasket() {
        cart.removeAllCartItems()
    }
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- svelte method, prevents user from clicking 
    `enter` and by-passing form validation checks,
    accessing Stripe right away. -->
<svelte:window on:keydown={e => { if (e.key === 'Enter') { e.preventDefault() }}} />

<!-- adding SEO title and meta-tags to the /basket page -->
<svelte:head>
    <!--
    ~~~~~~~~~~~~
    Primary Meta Tags;
    https://metatags.io/ -->
    <title>ENUCS | Your Basket</title>
    <meta name="title" content="ENUCS | Your Basket">
    <meta name="description" content="Computing Society | ENUCS | Merchandise shop basket checkout page">
    <meta name="keywords" content="computing society, 
        programming society, 
        computing society university, 
        society university, 
        web development society, 
        development society, 
        edinburgh napier university,
        enucs, 
        enu,
        university club,
        programming community,
        students,
        student,
        enu">
    <meta name="author" content="Miguel Bacharov">
    <!-- 
    ~~~~~~~~~~~~
    Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.enucs.org.uk/shop">
    <meta property="og:title" content="ENUCS | Your Basket">
    <meta property="og:description" content="Computing Society | ENUCS | Merchandise shop basket checkout page">

    <meta property="og:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
    <!--
    ~~~~~~~~~~~~
    Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.enucs.org.uk/shop">
    <meta property="twitter:title" content="ENUCS | Your Basket">
    <meta property="twitter:description" content="Computing Society | ENUCS | Merchandise shop basket checkout page">

    <meta property="twitter:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
</svelte:head>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    /* ===================
        MOBILE FIRST 
    =================== */

    /* 
    ~~~~~~~~~~~~~~~~~~~~
    form CSS STYLE
    */
    form label p,
    form legend p {
        font-weight: bold;
        margin-bottom: calc(100vw / (var(--mobile) / 7.35));
    }

    input[type='radio'] {
        width: calc(100vw / (var(--mobile) / 15));
        height: auto;
        margin-right: calc(100vw / (var(--mobile) / 7));
    }

    /* ship-input field */
    .ship-select-radio-container {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: start;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    table CSS STYLE (ORDER INFO)
    */
    table {
        border-collapse: separate;
    }

    td {
        padding-bottom: calc(100vw / (var(--mobile) / 7.35));
        padding-right: calc(100vw / (var(--mobile) / 19.5));
    }

    hr {
        width: calc(100vw / (var(--mobile) / 314.54));
        margin: calc(100vw / (var(--mobile) / 16.17)) 0;

        opacity: 0.25;
        border: 1.46983px solid #FF5555;
        background-color: #FF5555;
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~
    buttons-page
    */
    #checkout-btn {
        background-image: url('/assets/svg/white-card-vector.svg');
        background-size: calc(100vw / (var(--mobile) / 22.05)) calc(100vw / (var(--mobile) / 16.17));
    }
    #basket-clear-btn {
        background-image: url('/assets/svg/basket-bin-vector.svg');
        background-size: calc(100vw / (var(--mobile) / 22.05)) calc(100vw / (var(--mobile) / 16.17));
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~
    basket-item-card-CSS-style
    */
    #card-grid-container {
        display: grid;
        gap: 25px;
        align-content: center;
        align-items: center;
        justify-items: start;
        justify-content: center;
    }

    /* ===================
        TABLET FIRST 
    =================== */

    /* 767px is used to allow for IPad to use the Tablet Version */
    @media only screen and (min-width: 767px) {

        form {
            width: calc(100vw / (var(--tablet) / 315));
            margin-top: 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        hr {
            width: 100%;
        }

        input[type="text"],
        input[type="email"],
        select {
            width: calc(100vw / (var(--tablet) / 314.54));
            /* height: calc(100vw / (var(--tablet) / 50)); */
            height: calc(100vw / (var(--tablet) / 33.81));
            padding: calc(100vw / (var(--tablet) / 7));
        }

        input[type='radio'] {
            width: calc(100vw / (var(--tablet) / 15));
            margin-right: calc(100vw / (var(--tablet) / 7));
        }

        #checkout-btn {
            margin-top: calc(100vw / (var(--tablet) / 23));
            background-size: calc(100vw / (var(--tablet) / 22.05)) calc(100vw / (var(--tablet) / 16.17));
        }

        td {
            padding-bottom: calc(100vw / (var(--tablet) / 7.35));
            padding-right: calc(100vw / (var(--tablet) / 19.5));
        }
    }

    /* ===================
        DESKTOP FIRST 
    =================== */

    /* 1025px is used to allow for IPad Pro to use the Tablet Version */
    @media only screen and (min-width: 1025px) {

        form {
            width: calc(100vw / (var(--desktop) / 315));
            margin-top: 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: calc(100vw / (var(--desktop) / 120));
        }

        form label p,
        form legend p {
            margin-bottom: calc(100vw / (var(--desktop) / 7.35));
        }

        fieldset {
            margin-bottom: calc(100vw / (var(--desktop) / 11.76));
        }

        hr {
            width: 100%;
            margin: calc(100vw / (var(--desktop) / 16.17)) 0;
        }

        input[type="text"],
        input[type="email"],
        select {
            width: calc(100vw / (var(--desktop) / 314.54));
            /* height: calc(100vw / (var(--desktop) / 50)); */
            height: calc(100vw / (var(--desktop) / 33.81));
            padding: calc(100vw / (var(--desktop) / 7));
        }

        input[type='radio'] {
            width: calc(100vw / (var(--desktop) / 15));
            margin-right: calc(100vw / (var(--desktop) / 7));
        }

        #checkout-btn {
            margin-top: calc(100vw / (var(--desktop) / 23));
            background-size: calc(100vw / (var(--desktop) / 22.05)) calc(100vw / (var(--desktop) / 16.17));
        }

        td {
            padding-bottom: calc(100vw / (var(--desktop) / 7.35));
            padding-right: calc(100vw / (var(--desktop) / 19.5));
        }

        /* 
        ~~~~~~~~~~~~~~~~~~~~
        hover-effects */
        input:hover {
            padding: calc(100vw / (var(--desktop) / 5));
            border: 2.5px solid #FF5555;
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if showStripe}
    <StripeModal 
        data={stripeData}
        on:close={closeStripe}
        on:success={processPrintfulOrder}
    />
{/if}

<section in:fade>
    <!-- 
    ~~~~~~~~~~~~~~~
    page-title -->
    <h2 class='s-42 bold m-t-30'>
        YOUR BASKET
    </h2>
    <!-- 
    ~~~~~~~~~~~~~~~
    action-row basket -->
    <div class='row-space-out m-b-35'>
        <button 
            class='btn-primary'
            disabled>
            <p class='s-16'>
                {cartQuantity} basket items
            </p>
        </button>
        <button
            id='basket-clear-btn'
            class='btn-secondary btn-left-icon'
            on:click={() => clearBasket()}>
            <p class='s-16'>
                CLEAR BASKET
            </p>
        </button>
    </div>
    <!-- 
    ~~~~~~~~~~~~~~~
    basket-items-grid-display -->
    <div id='card-grid-container'>
        {#each cartItems as item}
            <BasketItemCard data={item} />
        {:else}
            <p class='s-14 bold color-secondary'>
                There are 0 items in your basket list!
                <br />
                <span class='s-12 not-bold'> Add at least 1 item to your basket to proceed to checkout </span>
            </p>
        {/each}
    </div>
    <!-- 
    ~~~~~~~~~~~~~~~
    basket total cost -->
    <p class='s-16 bold color-secondary m-t-40'>Basket Sub-Total: 
        <span class='s-20'>£ {cartCost}</span>
    </p>

    <hr />

    <!-- 
    ~~~~~~~~~~~~~~~
    form-header -->
    <div class='row-space-start m-t-25 m-b-10'>
        <img 
            class='m-r-10'
            src='./assets/svg/basket-shipping-van-vector.svg'
            alt=''
        />
        <h2 class='s-22 bold'> 
            Shipping Details 
        </h2>
    </div>
    <!-- 
    ~~~~~~~~~~~~~~~
    shipping-form-information -->    
    <form autocomplete="off" 
        on:submit|preventDefault={startStripe}>
        <!-- 
        ~~~~~~~~~~~~~~~
        NAME -->
        <fieldset class="form-group">
            <label 
                for="name"
            > 
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    Name 
                </p> 
            </label>
            <input 
                class="form-control s-16"
                name="name" 
                type="text" 
                required 
                bind:value={recipient.name}
            >
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        EMAIL -->
        <fieldset class="form-group">
            <label 
                for="vorname"
            > 
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    Email 
                </p> 
            </label>
            <input 
                class="form-control s-16" 
                name="email" 
                type="email" 
                required 
                bind:value={recipient.email}
            >
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        SHIPPING ADDRESS -->
        <fieldset class="form-group">
            <label 
                for="ship_address"
            > 
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    Address
                </p> 
            </label>
            <input 
                class="form-control s-16" 
                name="ship_address" 
                type="text" 
                required 
                bind:value={recipient.address1}
            >
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        COUNTRY CODE (DROPDOWN SELECT) -->
        <fieldset class="form-group">
            <label 
                for="country_code"
            > 
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    Country Code 
                </p> 
            </label>
            <select 
                class='form-control' 
                name='country_code' 
                required
                bind:value={recipient.country_code}
                on:change={getStateCodes}
            >
                <option class='s-16' value={undefined}> - select country code - </option>
                <!-- 
                load all of the values of THIS field -->
                {#each resCountriesList.result as item}
                    <option class='s-16' value={item.code}> { item.name } </option>
                {/each}
            </select>
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        STATE CODE (DROPDOWN SELECT) 
        dynamically generated -->
        {#if stateCodeArray}
            <fieldset class="form-group">
                <label 
                    for="state_code"
                > 
                    <p class='s-16'>
                        <span style="color: #C62828">*</span> 
                        State Code 
                    </p> 
                </label>
                <select 
                    class='form-control' 
                    name='state_code' 
                    required
                    bind:value={recipient.state_code}
                    on:change={clearLocation}
                >
                    <option class='s-16 bold' value=''> - select state code - </option>
                    <!-- 
                    load all of the values of THIS field -->
                    {#each resCountriesList.result as item}
                        {#if item.code == recipient.country_code && item.states != null}
                            {#each item.states as state}
                                <option class='s-16' value={ state.code }> { state.name } </option>
                            {/each}
                        {/if}
                    {/each}
                </select>
            </fieldset>
        {/if}
        <!-- 
        ~~~~~~~~~~~~~~~
        CITY -->
        <fieldset class="form-group">
            <label 
                for="city"
            > 
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    City 
                </p> 
            </label>
            <input 
                class="form-control s-16" 
                name="city" 
                type="text" 
                required 
                bind:value={recipient.city}
            >
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        ZIP-POSTCODE -->
        <fieldset class="form-group">
            <label 
                for="post_code"
            > 
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    Zip / Postcode 
                </p> 
            </label>
            <input 
                class="form-control s-16" 
                name="post_code"
                type="text" 
                required 
                bind:value={recipient.zip}
            >
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        SHIPPING-TYPE (RADIO BUTTON SELECT) -->
        <fieldset class="form-group">
            <label
                for="ship-type-contaier"
                >
                <p class='s-16 bold'>
                    <span style="color: #C62828">*</span> 
                    Shipping Type
                </p>
            </label>
            <div 
                class='ship-select-radio-container'
                name="ship-type-contaier"
                >
                <!--
                ~~~~~~~~~~~~~~~
                if the state of the form is complete to 
                establish the shipping type & costs -->
                {#if getShipRates}
                    {#await promiseShipCosts}
                        <ShippingLoader {...contentLoaderProps_1} />
                    {:then data}
                        {#each data.result as item}
                            <label style="display: flex;" 
                                in:fade> 
                                <input 
                                    type=radio 
                                    name='ship-typ'
                                    bind:group={shipPrice} 
                                    value={item}
                                    required
                                />
                                <span class='s-14'>
                                    <span class='bold'>{ item.id } | </span>{ item.minDeliveryDays } - { item.maxDeliveryDays } Days Delivery { item.currency } { item.rate } 
                                </span>
                            </label>
                        {/each}
                    {:catch error}
                        <p class='color-red'>{error.message}</p>
                    {/await}
                {:else}
                    <div class='row-space-start'>
                        <img 
                            class='m-r-5'
                            src='./assets/svg/exclamation-vector.svg'
                            alt=''
                        />
                        <p class='s-12 color-red bold'>
                            complete all fields to select shipping option
                        </p>
                    </div>
                {/if}
            </div>
        </fieldset>
        <!--
        ~~~~~~~~~~~~~~~
        SUBTOTAL BREAKDOWN INFORMATION -->
        {#if getTotalCosts}
            {#await promise}
                <hr />
                <OrderCostLoader {...contentLoaderProps_2} />
                <hr />
            {:then data}
                <!-- 
                ~~~~~~~~~~~~~~~
                order breakdown table -->
                <div in:fade>
                    <!-- html-divider -->
                    <hr /> 

                    <!-- html-table-title -->
                    <p class='s-22 bold m-b-10 color-red'>
                        Order Breakdown
                    </p>

                    <!-- html-table -->
                    <table>
                        <tr>
                            <td>
                                <p class='s-16 bold color-secondary'>Items Quantity</p>
                            </td>
                            <td>
                                <p class='s-16 color-secondary'>
                                    x{cartQuantity}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class='s-16 bold color-secondary'>Item Cost (+ VAT)</p>
                            </td>
                            <td>
                                <p class='s-16 color-secondary'> {data.result.retail_costs.total + data.result.costs.vat} {data.result.retail_costs.currency} </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class='s-16 bold color-secondary'>Shipping costs</p>
                            </td>
                            <td>
                                {#if shipPrice != undefined }
                                    <p class='s-16 color-secondary'>
                                        {shipPrice.rate} {shipPrice.currency}
                                    </p>
                                {:else}
                                    <div class='row-space-start'>
                                        <img 
                                            class='m-r-5'
                                            src='./assets/svg/exclamation-vector.svg'
                                            alt=''
                                        />
                                        <p class='s-12 color-red bold'>
                                            shippment not selected
                                        </p>
                                    </div>
                                {/if}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class='s-16 bold color-secondary'>Delivery Time</p>
                            </td>
                            <td>
                                {#if shipPrice != undefined }
                                    <p class='s-16 color-secondary'>
                                        {shipPrice.minDeliveryDays} - {shipPrice.maxDeliveryDays} Days
                                    </p>
                                {:else}
                                    <div class='row-space-start'>
                                        <img 
                                            class='m-r-5'
                                            src='./assets/svg/exclamation-vector.svg'
                                            alt=''
                                        />
                                        <p class='s-12 color-red bold'>
                                            shippment not selected
                                        </p>
                                    </div>
                                {/if}
                            </td>
                        </tr>
                        <!-- 
                        ~~~~~~~~~~~~~~~
                        FINAL CHECKOUT INFORMATION - 
                        TOTAL PRICE TO PAY-->
                        <tr>
                            <td style='vertical-align: bottom;'>
                                <p class='s-22 bold color-secondary'>Total</p>
                            </td>
                            <td>
                                {#if shipPrice != undefined }
                                    <span class='s-32 bold color-secondary' disabled> {parseInt(data.result.retail_costs.total) + parseInt(data.result.costs.vat) + parseInt(shipPrice.rate)} {data.result.retail_costs.currency} </span>
                                {/if}
                            </td>
                        </tr>
                    </table>

                    <!-- html-divider -->
                    <hr />
                </div>
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        {/if}  
        <!-- 
        ~~~~~~~~~~~~~~~
        CHECKOUT STRIPE OPEN -->
        <button 
            id='checkout-btn'
            class='btn-blue btn-left-icon m-t-20'
            type="submit">
            <p class='s-18'>
                PROCEED TO CHECKOUT
            </p>
        </button>
    </form>
</section>