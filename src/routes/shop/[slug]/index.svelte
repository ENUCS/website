<script context="module" lang='ts'>
    import { 
        post 
    } from '../../../utils/init.js'

    import type {
        Preload
    } from "@sapper/common"

    /**
     * Function Sapper PRE-LOAD;
     * ~~~~~~~~~~~~~~~~~~~~
     * Descrption:
     * This function / method preloads
     * with the loading web-page 
     * @param this
     * @param param1
    */
    export const preload: Preload = async function (this, { host, params }) {
        
        // get the page `/shop/<id>` slug value (id)
        const { slug } = params;
        // ~~~~~~~~~~~~~~~~~~~~~
        // get the page `http(s)://[domain-route] to comply with project strict CORS on Pre-loads
        let protocol: string
        if (process.env.NODE_ENV != 'production') { 
            protocol = 'http://'
        } else {
            protocol = 'https://'
        }
        // ~~~~~~~~~~~~~~~~~~~~~
        // get the list of `shop-data` from Printful-API
        const res = await post(`${protocol}${host}/shop/printful`, {
            method: 'GET',
            endpoint: `store/products/${slug}`,
        })
        // ~~~~~~~~~~~~~~~~~~~~~
        // get the list of `ship-to` countries by Printful-API
        const resCountriesList = await post(`${protocol}${host}/shop/printful`, {
            method: 'GET',
            endpoint: `countries`,
        })
        // ~~~~~~~~~~~~~~~~~~~~~
        // return these pieces of data as `export let ...`
        return {
            res, 
            resCountriesList
        };
    }
</script>

<!-- 
~~~~~~~~~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~~~~~~~~~
-->

<script lang="ts">
    import { goto } from '@sapper/app';

    import type {
        responseListProductVariants
    } from '../../../api/modals/proucts_printful'

    import type {
        UserAddress,
        RequestEsimateOrderCosts,
        ResponseEstimateOrderCosts,
        NewOrder,
        Item
    } from '../../../api/modals/orders_printful'

    import type {
        responseCountryList
    } from '../../../api/modals/countries_printful'

    import type {
        ItemInfo,
        UserAddressInfo,
        ShippingInfo,
        RequestShippingRates,
        ResponseShippingRates
    } from '../../../api/modals/shipping-rates-printful'

    import StripeModal from './_StripeModal.svelte'

    export let res: responseListProductVariants
    export let resCountriesList: responseCountryList

    // ~~~~~~~~~~~~~~~~~~~~
    // SET-UP FOR THE ORDER PRICE ESTIMATE
    // ~~~~~~~~~~~~~~~~~~~~

    let recipient: UserAddress = {          // a dynamic binding Object for UserAddress;
        name: undefined,
        address1: undefined,
        zip: undefined,
        email: undefined,
        city: undefined,
        state_code: undefined,
        country_code: undefined,
    }
    let selectedItem: Item = undefined      // contains the selected option/item of merch
    let shipPrice: ShippingInfo = undefined // contains the selected shipping-type-option

    // test-dev
    // if (process.env.NODE_ENV != 'production') {
    //     recipient.name = 'm'
    //     recipient.address1 = 'London'
    //     recipient.zip = 'EH10 4PJ'
    //     recipient.email = 'whateveremail@gmial.com'
    //     recipient.city = 'London'
    //     recipient.state_code = ''
    //     recipient.country_code = 'UK'
    // } 

    let itemQuantity: number = 0             // item quantity
    $: if (selectedItem != undefined) {
        selectedItem.quantity = itemQuantity // setting the quantity as an instantiating value
    }
    
    let items: Array<Item>                   // (Order API) a dynamic binding Array<Item>
    $: items = [selectedItem]                // [SvelteJS - Reactivity] declaring the final INTERFACE for ITEM
    
    let newOrder: NewOrder                   // (Order API) a dynamic binding Object for NewOrder;
    $: newOrder = {                          // [SvelteJS - Reactivity] declaring the final INTERFACE for NewOrder
        recipient: recipient,
        items: items
    }

    // ~~~~~~~~~~~~~~~~~~~~
    // SET-UP FOR SHIPPING RATE
    // ~~~~~~~~~~~~~~~~~~~~
    
    let recipient_2: UserAddressInfo            // (Shipping Rate API) a static idle variable for UserAddressInfo
    let selectedItem_2: ItemInfo;               // (Shipping Rate API) a static idle variable for ItemInfo
    let items_2: Array<ItemInfo>                // (Shipping Rate API) a static idle variable for Array<ItemInfo>
    let newShippingRate: RequestShippingRates   // (Shipping Rate API) a static idle variable for RequestShippingRates

    let promise: Promise<ResponseEstimateOrderCosts>        // promise `instantiated` to obtain the `OrderEstimateCosts`
    let promiseShipCosts: Promise<ResponseShippingRates>    // promise `instantiated` to obtain the `ResponseShippingRates`

    let getTotalCosts: boolean = false      // boolean trigger the rendering of the `total order costs` section
    let getShipRates: boolean = false       // boolean trigger the rendering of the `shippment rates` section

    /**
     * [SvelteJS - Reactivity]
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * A dynamic checker that allows for the
     * verification if all of the form fields 
     * have been completed, to trigger the
     * dynamic API requests to the Printful API
     * to obtain `estimate-order-costs` and `shipping-rates`
     * data respectively.
     * 
     * If the fields have not been filled-out,
     * `hide` the fields that need `form-data`
     * to render correclty.
    */
    $: if (selectedItem != undefined
        && itemQuantity != 0
        && recipient.name != undefined
        && recipient.address1 != undefined
        && recipient.city != undefined
        && recipient.country_code != undefined
        && recipient.email != undefined 
        && recipient.state_code != undefined
        && recipient.zip != undefined) {

            console.log('all form fields have been completed!')

            recipient_2 = {
                address1: recipient.address1,
                zip: recipient.zip,
                city: recipient.city,
                state_code: recipient.state_code,
                country_code: recipient.country_code
            }
            selectedItem_2 = {
                variant_id: selectedItem.variant_id.toString(),
                external_variant_id: selectedItem.external_id.toString(),
                warehouse_product_variant_id: selectedItem.warehouse_product_variant_id != null ? selectedItem.warehouse_product_variant_id.toString() : '',
                quantity: selectedItem.quantity,
                value: selectedItem.retail_price
            }
            items_2 = [selectedItem_2]
            newShippingRate = {
                recipient: recipient_2,
                items: items_2
            }

            // calculate an Estimate for OrderCosts & Expenses
            promise = estimateOrderCosts(newOrder)
            getTotalCosts = true // show - render the order costs container

            // calculate Shipping Rates and Shipping Type
            promiseShipCosts = getShippingRates(newShippingRate)
            getShipRates = true // show - render the shipping field
    } else {
        getTotalCosts = false   // hide the order costs container
        getShipRates = false    // hide the shipping field
    }
    
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
     * Function / Method
     * [MUST FUNCTION TO POPULATE SHIPPING RATE DROPDOWN]
     * [WORKING / COMPLETE]
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * Estimate Order Costs for 
     * the user dynamically. This
     * function makes a async/dynamic
     * request to the Printful-API
     * to estiamte order costs, taxes,
     * printful costs...
    */
    async function estimateOrderCosts(data: any): Promise<ResponseEstimateOrderCosts> {
        const _data = {
            method: 'POST',
            endpoint: `orders/estimate-costs`,
            data: data
        }
        const response = await post(`shop/printful`, _data)
        console.log(response)
        // itercept key data elements and store in the JS;
        stripeData.amountToPay = parseInt(response.result.retail_costs.total) + parseInt(response.result.costs.vat)
        stripeData.currenyPay = response.result.retail_costs.currency
        return response
    }
    
    $: if (shipPrice != undefined) {
        console.log('shipPrice changed', shipPrice)
        stripeData.amountToPay += parseInt(shipPrice.rate)
    }

    /**
     * Function / Method
     * [MUST FUNCTION TO POPULATE SHIPPING RATE DROPDOWN]
     * [WORKING / COMPLETE]
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * Obtain Avaialble Shipping Rates
     * & Options for the User as well as
     * the shipping speed and the shipping costs
    */
    async function getShippingRates(data: any): Promise<ResponseShippingRates> {
        const _data = {
            method: 'POST',
            endpoint: `shipping/rates`,
            data: data
        }
        const response = await post(`shop/printful`, _data)
        shipPrice = undefined
        return response
    }

    /**
     * Function / Method
     * [SvelteJS - Reactivity]
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * Verify that the Country Field
     * has been selected and chec wehter
     * there are any StateCodes avaialble.
     * 
     * Hide / Show StateCode Field.
    */
    let stateCodeArray: boolean = false;
    function getStateCodes() {
        // loop-thorough all of the countries list and identify the selected target country;
        for (let element of resCountriesList.result) {
            // if country code matches the selected, check if it has any state codes;
            if (element.code == recipient.country_code && element.states != null) {
                stateCodeArray = true               // display the statecode field
                recipient.state_code = undefined
                clearLocation()
                console.info('StateCode Visible')
                return;
            }
        }
        console.info('State Code Hidden')
        stateCodeArray = false          // else keep the statecode field hidden;
        recipient.state_code = ''       // place the state-code values as NOT undefined, but rather empty to pass the check
        clearLocation()                 // clear other field options
    }

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * Clearing up the further location
     * field data for the user upon field
     * country / OR state code change
    */
    function clearLocation() {
        console.log('clearing options')
        recipient.city = undefined
        recipient.zip = undefined
        shipPrice = undefined
    }

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * Handles the closing of the Stripe Modal
    */
    let showStripe: boolean = false
    function closeStripe() {
        showStripe = false;
    }

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
     * Descrption:
     * Loading up the Stripe Information
     * for the correct use of the website
    */
    function startStripe() {
        // load stripe and proceed to checkout
        showStripe = true;
    }

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * Porcess the Printful Order and 
     * Submit it for Review
    */
    async function processPrintfulOrder() {
        // if Stripe is Successful, process the Printful Order;
        showStripe = false; // close stripe modal
        // alert('Processing the Order')
        
        const _data = {
            method: 'POST',
            endpoint: `orders`,
            data: newOrder
        }
        const response = await post(`shop/printful`, _data)
        console.log(response)
        goto('/shop')
    }
</script>

<!-- 
~~~~~~~~~~~~
	SVELTE INJECTION TAGS
~~~~~~~~~~~~
-->

<svelte:head>
    <!--
    ~~~~~~~~~~~~
	Primary Meta Tags;
	https://metatags.io/ -->
    <title>ENUCS | Shop { res.result.sync_product.name }</title>
    <meta name="title" content="ENUCS | Shop { res.result.sync_product.name }">
    <meta name="description" content="Computing Society | ENUCS | Merchandise Shop">
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
    <meta property="og:title" content="ENUCS | Shop { res.result.sync_product.name }">
    <meta property="og:description" content="Computing Society | ENUCS | Merchandise Shop">

    <meta property="og:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
    <!--
    ~~~~~~~~~~~~
	Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.enucs.org.uk/shop">
    <meta property="twitter:title" content="ENUCS | Shop { res.result.sync_product.name }">
    <meta property="twitter:description" content="Computing Society | ENUCS | Merchandise Shop">

    <meta property="twitter:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
</svelte:head>

<!-- 
~~~~~~~~~~~~~~~~~~~~
    COMPONENT STYLE
~~~~~~~~~~~~~~~~~~~~
-->

<style>
    section {
        margin: calc(100vw / 3.02419354839) calc(100vw / 19.7368421053);
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    back-btn CSS STYLE
    */
    #back-to-shop {
        background-image: url('/assets/svg/back-arrow-icon.svg');
        background-position: left 0 top 50%;
        /* background-size: calc(100vw / (var(--mobile) / 30)) calc(100vw / (var(--mobile) / 28)); */
        background-size: contain;
        margin: calc(100vw / (var(--mobile) / 32)) 0 calc(100vw / (var(--mobile) / 43)) 0;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    item image CSS STYLE
    */
    #item-img {
        width: calc(100vw / (var(--mobile) / 340.88));
        height: calc(100vw / (var(--mobile) / 364.62));
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    form CSS STYLE
    */
    form {
        margin-top: calc(100vw / (var(--mobile) / 43.38));
    }
    form fieldset#select-option-top {
        margin-bottom: calc(100vw / (var(--mobile) / 43.74));
    }
    form #ship-header {
        margin-bottom: calc(100vw / (var(--mobile) / 19.11));
    }
    label p {
        font-family: 'Roboto Slab';
        font-weight: bold;
        margin-bottom: calc(100vw / (var(--mobile) / 7.35));
    }
    input[type='radio'] {
        width: calc(100vw / (var(--mobile) / 15));
        height: auto;
        margin-right: calc(100vw / (var(--mobile) / 7));
    }
    .ship-select-radio-container {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: start;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    table CSS STYLE
    */
    table {
        border-collapse: separate;
        /* border-spacing: 50px 0; */
    }
    td {
        padding-bottom: calc(100vw / (var(--mobile) / 7.35)) ;
        padding-right: calc(100vw / (var(--mobile) / 7.35));
    }
    hr {
        margin: calc(100vw / (var(--mobile) / 16.17)) 0;
        opacity: 0.25;
        border: 1.46983px solid #FF5555;
        background-color: #FF5555;
        width: calc(100vw / (var(--mobile) / 314.54));
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~
    final submissions
    */
    #checkout-btn {
        margin-top: calc(100vw / (var(--mobile) / 6.2));
        background-image: url('/assets/svg/card-vector.svg');
        background-size: calc(100vw / (var(--mobile) / 22.05)) calc(100vw / (var(--mobile) / 16.17));
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~
    RESPONSIVENESS:
    Support for DESKTOP;
    ~~~~~~~~~~~~~~~~~~~~
    */

    /*
    =============================
    DESKTOP (& UP) - 1024px 
    100vw - measured from 1440px */
    @media only screen and (min-width: 1024px) {

        #checkout-container {
            display: grid;
            /* grid-auto-flow: column; */
            gap: calc(100vw / 22.1538461538);
            grid-template-columns: repeat(auto-fill, calc(100vw / 6.20689655172));
        }
        /* 
        ~~~~~~~~~~~~~~~~~~~~
        hover-effects */
        #back-to-shop:hover {
            background-image: url('/assets/svg/back-arrow-icon-hover.svg');
        }
        input:hover {
            padding: calc(100vw / (var(--mobile) / 5));
            border: 2.5px solid #FF5555;
        }
    }
</style>

<!-- 
~~~~~~~~~~~~~~~~~~~~
	COMPONENT HTML
~~~~~~~~~~~~~~~~~~~~
-->

<!-- <ContentLoader /> -->
<!-- <ListLoader /> -->

{#if showStripe}
    <StripeModal 
        data={stripeData}
        on:close={closeStripe}
        on:success={processPrintfulOrder}
    />
{/if}

<section>
    <!-- 
    ~~~~~~~~~~~~~~~
    page-title -->
    <h2 class='s-42 bold'>
        SHOP / <span class='color-primary'> { res.result.sync_product.name } </span>
    </h2>
    <!-- 
    ~~~~~~~~~~~~~~~
    back-button -->
    <a rel='prefetch' href="/shop">
        <button id='back-to-shop' 
            class='btn-primary btn-left-icon'>
            <p class='s-20 bold'>
                BACK TO SHOP
            </p>
        </button>
    </a>
    <!-- 
    ~~~~~~~~~~~~~~~
    user-product-card-view -->
    {#if selectedItem != undefined}
        {#each res.result.sync_variants as item}
            {#if item.name == selectedItem.name}
                {#each item.files as itemFiles}
                    {#if itemFiles.type == 'preview'}
                        <img 
                            id='item-img'
                            width="250px"
                            height="250px"
                            src={itemFiles.preview_url}
                            alt=""
                        />
                    {/if}
                {/each}
            {/if}
        {/each}
    {/if}
    <!-- 
    ~~~~~~~~~~~~~~~
    form to fill out by the user -->
    <form on:submit|preventDefault={startStripe}>
        <!-- 
        ~~~~~~~~~~~~~~~
        SIZE / OPTION (DROPDOWN SELECT) -->
        <fieldset class="form-group">
            <label 
                for="size"
            >
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    Size / Option 
                </p> 
            </label>
            <select 
                class='form-control' 
                name='size' 
                required
                bind:value={selectedItem}
            >
                <option class='s-16' value={undefined}> - SELECT SIZE / OPTION - </option>
                <!-- 
                load all of the values of THIS field -->
                {#each res.result.sync_variants as item}
                    <option class='s-16' value={item}> {item.name} </option>
                {/each}
            </select>
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        QUANTITY / OPTION (DROPDOWN SELECT) -->
        <fieldset class="form-group"
            id='select-option-top'>
            <label 
                for="quantity"
            >
                <p class='s-16'>
                    <span style="color: #C62828">*</span> 
                    Quantity 
                </p> 
            </label>
            <select 
                class='form-control' 
                name='quantity' 
                required
                bind:value={itemQuantity}
            >
                <option class='s-16' value={0}> - SELECT QUANTITY - </option>
                {#each {length: 10} as _, i}
                    <option class='s-16' value={i + 1}> {i + 1} </option>
                {/each}
            </select>
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        SHIPPING DETAILS HEADER -->
        <h2 class='s-22 bold'
            id='ship-header'> 
            Shipping Details 
        </h2>
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
                    Shipping Address 
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
        STATE CODE (DROPDOWN SELECT) -->
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
                        <p>...loading shipping options...</p>
                    {:then data}
                        {#each data.result as item}
                            <input 
                                type=radio 
                                name='ship-typ'
                                bind:group={shipPrice} 
                                value={item}
                                required
                            >
                            <label for='shipType' class='s-14'>{ item.id } | { item.minDeliveryDays } - { item.maxDeliveryDays } Days Delivery { item.currency } { item.rate } </label>
                        {/each}
                    {:catch error}
                        <p style="color: red">{error.message}</p>
                    {/await}
                {:else}
                    <p class='s-16' style="color: red"> please complete all fields </p>
                {/if}
            </div>
        </fieldset>
        <!--
        ~~~~~~~~~~~~~~~
        SUBTOTAL BREAKDOWN INFORMATION -->
        {#if getTotalCosts}
            {#await promise}
                <p>...Calcualting Order Prices...</p>
            {:then data}
                <div>
                    <!-- 
                    ~~~~~~~~~~~~~~~
                    order breakdown table -->
                    <div>
                        <hr />
                            <p class='s-22 bold' style="color: #C62828">
                                Order Breakdown
                            </p>
                            <table>
                                <tr>
                                    <td>
                                        <p class='s-16 bold'>Shipping costs</p>
                                    </td>
                                    <td>
                                        {#if shipPrice != undefined }
                                            <p class='s-16'>
                                                {shipPrice.currency} {shipPrice.rate}
                                            </p>
                                        {:else}
                                            <p class='s-16' style='color: #C62828'>
                                                please select shippment type
                                            </p>
                                        {/if}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p class='s-16 bold'>Quantity</p>
                                    </td>
                                    <td>
                                        <p class='s-16'>
                                            x{itemQuantity}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p class='s-16 bold'>Item Cost (+ VAT)</p>
                                    </td>
                                    <td>
                                        <p class='s-16'>{data.result.retail_costs.currency} {data.result.retail_costs.total + data.result.costs.vat} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p class='s-16 bold'>Delivery Time</p>
                                    </td>
                                    <td>
                                        {#if shipPrice != undefined }
                                            <p class='s-16'>
                                                {shipPrice.minDeliveryDays} - {shipPrice.maxDeliveryDays} Days
                                            </p>
                                        {:else}
                                            <p class='s-16' style='color: #C62828'>
                                                please select shippment type
                                            </p>
                                        {/if}
                                    </td>
                                </tr>
                            </table>
                        <hr />
                    </div>
                    <!-- 
                    ~~~~~~~~~~~~~~~
                    FINAL CHECKOUT INFORMATION - 
                    TOTAL PRICE TO PAY-->
                    <div>
                        <p class='s-22 bold'>
                            Sub-Total
                            {#if shipPrice != undefined }
                                <span disabled> {data.result.retail_costs.currency} {parseInt(data.result.retail_costs.total) + parseInt(data.result.costs.vat) + parseInt(shipPrice.rate)} </span>
                            {/if}
                        </p>
                    </div>
                </div>
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        {/if}  
        <!-- 
        ~~~~~~~~~~~~~~~
        CHECOUT STRIPE OPEN -->
        <button 
            id='checkout-btn'
            class='btn-secondary 
                btn-right-icon'
            type="submit">
            <p class='s-20 bold'>
                PROCEED TO CHECKOUT
            </p>
        </button>
    </form>
</section>