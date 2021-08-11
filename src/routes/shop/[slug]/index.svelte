<!-- src/routes/blog/[slug].svelte -->
<script context="module" lang='ts'>
    import {
        get
    } from '../../../api/printful'
    import type {
        Preload
    } from "@sapper/common";;

    /**
     * Function Sapper PRE-LOAD;
     * Descrption:
     * This function / method preloads
     * with the loading web-page 
     * @param this
     * @param param1
     */
    // export async function preload({ params, query }) {
    export const preload: Preload = async function (this, {
        params
    }) {
        const {
            slug
        } = params;
        // if (process.env.NODE_ENV != 'production') {
        //     console.debug('shop-[slug]-index.svelte', slug)
        // } // test-dev

        const res = await get(`store/products/${slug}`)
        if (process.env.NODE_ENV != 'production') {
            console.debug('shop-[slug]-index.svelte', res)
        } // test-dev

        const resCountriesList = await get(`countries`)
        // if (process.env.NODE_ENV != 'production') {
        //     console.debug('shop-[slug]-index.svelte', resCountriesList)
        // } // test-dev


        return {
            res, resCountriesList
        };
    }
</script>


<!-- 
~~~~~~~~~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~~~~~~~~~
-->


<script lang="ts">
    import {
        post
    } from '../../../api/printful'
    
    import type {
        responseListProductVariants
    } from '../../../api/modals/proucts_printful'

    import type {
        createNewOrder,
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

    export let res: responseListProductVariants
    export let resCountriesList: responseCountryList

    // ~~~~~~~~~~~~~~~~~~~~
    // SET-UP FOR THE ORDER PRICE ESTIMATE
    // ~~~~~~~~~~~~~~~~~~~~

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

    let selectedItem: Item = undefined      // a dynamic variable for Item
    let itemQuantity: number = 0            // number of item Quantities
    $: if (selectedItem != undefined) {
        selectedItem.quantity = itemQuantity // setting the qquantity as an instantiating value
    }
    let items: Array<Item>                   // a dynamic binding Array<Item>
    $: items = [selectedItem]                // declaring the final INTERFACE for ITEM
    $: console.info('selectedItem', selectedItem)

    
    let newOrder: NewOrder  // a dynamic binding Object for NewOrder;
    $: newOrder = {
        recipient: recipient,
        items: items
    }

    // ~~~~~~~~~~~~~~~~~~~~
    // SET-UP FOR SHIPPING RATE
    // ~~~~~~~~~~~~~~~~~~~~
    
    let recipient_2: UserAddressInfo            // a dynamic binding Object for UserAddressInfo;
    let selectedItem_2: ItemInfo;               // a dynamic binding Array<Object> for Item;
    let items_2: Array<ItemInfo>                // a dynamic bidning Array<ItenInfo>;
    let newShippingRate: RequestShippingRates   // a dynamic binding RequestShippingRates

    let promise: Promise<ResponseEstimateOrderCosts>        // promise `instantiated` to obtain the `OrderEstimateCosts`
    let promiseShipCosts: Promise<ResponseShippingRates>    // promise `instantiated` to obtain the `ResponseShippingRates`

    let getTotalCosts: boolean = false      // boolean trigger the rendering of the `total order costs` section
    let getShipRates: boolean = false       // boolean trigger the rendering of the `shippment rates` section

    // a dynamic biding Object for Estimating Order Costs
    // when all of the fields have been selected;
    $: if (selectedItem != undefined 
        && recipient.name != undefined
        && recipient.address1 != undefined
        && recipient.city != undefined
        && recipient.country_code != undefined
        && recipient.email != undefined 
        && recipient.state_code != undefined
        && recipient.zip != undefined) {

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

            // form-wesbite is ready to calculate
            // complete order costs & expenses;
            if (process.env.NODE_ENV != 'production') {
                console.debug('shop-[slug]-index.svelte', newOrder)
            } // test-dev
            promise = estimateOrderCosts(newOrder)
            getTotalCosts = true

            // form-website is ready to calculate shipping
            // options & costs;
            if (process.env.NODE_ENV != 'production') {
                console.debug('shop-[slug]-index.svelte', newShippingRate)
            } // test-dev
            promiseShipCosts = getShippingRates(newShippingRate)
            getShipRates = true
    }


    $: console.info('getTotalCosts', getTotalCosts);
    $: console.info('getShipRates', getShipRates);

    
    /**
     * Function / Method
     * Description:
     * Estimate Order Costs for 
     * the user dynamically 
    */
    async function estimateOrderCosts(data: any): Promise<ResponseEstimateOrderCosts> {
        const response = await post(`orders/estimate-costs`, data)
        if (process.env.NODE_ENV != 'production') {
            console.debug('shop-[slug]-index.svelte', response)
        } // test-dev
        return response
    }
    // let promise = estimateOrderCosts(newOrder)


    /**
     * Function / Method
     * [MUST FUNCTION TO POPULATE SHIPPING RATE DROPDOWN]
     * Description:
     * Obtain Avaialble Shipping Rates
     * & Options for the User 
    */
    async function getShippingRates(data: any): Promise<ResponseShippingRates> {
        const response = await post(`shipping/rates`, data)
        if (process.env.NODE_ENV != 'production') {
            console.debug('shop-[slug]-index.svelte', response)
        } // test-dev
        return response
    }


    let shipPrice: ShippingInfo = undefined
    $: console.info('shipPrice', shipPrice)


    /**
     * Function / Method
     * Descrption:
     * Loading up the Stripe Information
     * for the correct use of the website
    */
    function startStripe() {
        // load stripe and proceed to checkout
        alert('starting Stripe Checkout');
        // if Stripe is Successful, process the Printful Order;
        // processPrintfulOrder()
    }
    

    /**
     * Function / Method
     * Description:
     * Porcess the Printful Order and 
     * Submit it for Review
    */
    function processPrintfulOrder() {
        // validate the form information,
        // execute the order from PrintFul,
    }
</script>


<!-- SOLVING CORS ISSUES -->
<!-- https://www.w3.org/wiki/CORS_Enabled -->


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
            >
                <option class='s-16' value=''> - select country code - </option>
                <!-- 
                load all of the values of THIS field -->
                {#each resCountriesList.result as item}
                    <option class='s-16' value={ item.code }> { item.name } </option>
                {/each}
            </select>
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        STATE CODE (DROPDOWN SELECT) -->
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
            >
                <option class='s-16 bold' value=''> - select state code - </option>
                <!-- 
                load all of the values of THIS field -->
                {#if recipient.country_code != undefined}
                    {#each resCountriesList.result as item}
                        {#if item.code == recipient.country_code && item.states != null}
                            {#each item.states as state}
                                <option class='s-16' value={ state.code }> { state.name } </option>
                            {/each}
                        {:else if item.code == recipient.country_code && item.states == null}
                            <option class='s-16' value=''> empty field </option>
                        {/if}
                    {/each}
                {:else}
                    <option class='s-16' value=''> Please Select Country Code First </option>
                {/if}
            </select>
        </fieldset>
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
            <p class='s-16 bold'>
                <span style="color: #C62828">*</span> 
                Shipping Type
            </p> 
            <div class='ship-select-radio-container'>
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
                            <label for='shipType' class='s-16'>{ item.id } | { item.minDeliveryDays } - { item.maxDeliveryDays } Days Delivery { item.currency } { item.rate } </label>
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
                                <span class='s-22 bold'> {data.result.retail_costs.currency} {data.result.retail_costs.total + data.result.costs.vat + parseInt(shipPrice.rate)} </span>
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