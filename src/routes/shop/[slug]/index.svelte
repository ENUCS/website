<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->
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

        // get the page `http(s)://[domain-route] to comply with project strict CORS on Pre-loads
        let protocol: string
        if (process.env.NODE_ENV != 'production') { 
            protocol = 'http://'
        } else {
            protocol = 'https://'
        }

        // get the entire list of `shop-data` from Printful-API
        const res: responseListProductVariants = await post(`${protocol}${host}/shop/printful`, {
            method: 'GET',
            endpoint: `store/products/${slug}`,
        })
        
        // declare all of the differet item variant_ids (no-duplicates);
        let syncVariantProductId = res.result.sync_variants[0].product.product_id

        // Returns information about a specific product and a list of variants for this product;
        const resAllVariant: ResponseAllProductVariant = await post(`${protocol}${host}/shop/printful`, {
            method: 'GET',
            endpoint: `products/${syncVariantProductId}`,
        })

        // make a unique set (array) of values for the `variant_ids`;
        let syncVariantArray = res.result.sync_variants
        const itemProductIds = syncVariantArray.map(variant => variant.variant_id)
        const itemProductIdArray = Array.from(new Set(itemProductIds))

        // iterate over the response of ALLTHE VARIENTS, and identify the matching `variant_ids` for this product;
        resAllVariant.result.variants.filter(variant => {

            // if ID's of the `ALL LIST` match the Array of IDs for this product from the shop;
            if (itemProductIdArray.includes(variant.id)) {

                // append `this` varient information to the overall initial `res` of the product, which is then passed to the component;
                res.result.sync_variants.filter(vairant2 => {
                    if (vairant2.variant_id == variant.id) {
                        vairant2.further_variant_info = variant
                    }
                })
            }
        })

        // get the list of `ship-to` countries by Printful-API, used to identify and populate
        // the `shipping-country & state-codes input dropdown fields;
        const resCountriesList = await post(`${protocol}${host}/shop/printful`, {
            method: 'GET',
            endpoint: `countries`,
        })

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
        SyncVariant,
        responseListProductVariants
    } from '../../../models/printful/proucts_printful'

    import type {
        UserAddress,
        RequestEsimateOrderCosts,
        ResponseEstimateOrderCosts,
        NewOrder,
        Item
    } from '../../../models/printful/orders_printful'

    import type {
        responseCountryList
    } from '../../../models/printful/countries_printful'

    import type {
        ItemInfo,
        UserAddressInfo,
        ShippingInfo,
        RequestShippingRates,
        ResponseShippingRates
    } from '../../../models/printful/shipping-rates-printful'

    import type {
        ResponseVariant,
        ResponseAllProductVariant
    } from '../../../models/printful/printful-catalog-api'

    import { fade } from 'svelte/transition';

    import StripeModal from './_StripeModal.svelte'

    export let res: responseListProductVariants
    export let resCountriesList: responseCountryList

    // SORT COUNTRY LIST BY NAME
    resCountriesList.result = resCountriesList.result.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

    // ~~~~~~~~~~~~~~~~
    // DECLARE ITEM / PRODUCT VALUES
    // ~~~~~~~~~~~~~~~~
    
    // declare item properties, & options;
    let varaintsArray = res.result.sync_variants

    const mapColors = new Map()
    // declare item colors (no-duplicates);
    varaintsArray.map(variant => {
        mapColors.set(variant.further_variant_info.color, variant.further_variant_info.color_code)
        return
    })
    const itemColors = Array.from(mapColors)

    // declare item sizes (no-duplicates);
    const itemSizesArray = varaintsArray.map(variant => variant.further_variant_info.size)
    let itemSizes = Array.from(new Set(itemSizesArray))

    // initiaiting component `Promises`;
    let promise: Promise<ResponseEstimateOrderCosts>
    let promiseShipCosts: Promise<ResponseShippingRates>
    
    // ~~~~~~~~~~~~~~~~~~~~
    // SET-UP FOR THE ORDER
    // PRICE ESTIMATE
    // ~~~~~~~~~~~~~~~~~~~~
    
    let recipient: UserAddress = {              // a dynamic binding Object for UserAddress;
        name: undefined,
        address1: undefined,
        zip: undefined,
        email: undefined,
        city: undefined,
        state_code: undefined,
        country_code: undefined,
    }
    let temp_selectedItem: SyncVariant = undefined
    let selectedItem: Item = undefined          // contains the selected option/item of merch
    let shipPrice: ShippingInfo = undefined     // contains the selected shipping-type-option

    let itemQuantity: number = 0                // item quantity
    $: if (selectedItem != undefined) {
        selectedItem.quantity = itemQuantity    // setting the quantity as an instantiating value
    }
    
    let items: Array<Item>                      // (Order API) a dynamic binding Array<Item>
    $: items = [selectedItem]                   // [SvelteJS - Reactivity] declaring the final INTERFACE for ITEM
    
    let newOrder: NewOrder                      // (Order API) a dynamic binding Object for NewOrder;
    $: newOrder = {                             // [SvelteJS - Reactivity] declaring the final INTERFACE for NewOrder
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

    let getTotalCosts: boolean = false      // boolean trigger the rendering of the `total order costs` section
    let getShipRates: boolean = false       // boolean trigger the rendering of the `shippment rates` section

    /**
     * [SvelteJS - Reactivity]
     * ~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
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

            // Filling fields necessary for shipping-cost,
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
        // itercept key data elements and store in the JS;
        stripeData.amountToPay = parseInt(response.result.retail_costs.total) + parseInt(response.result.costs.vat)
        stripeData.currenyPay = response.result.retail_costs.currency
        return response
    }
    
    $: if (shipPrice != undefined) {
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
     * ~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
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
                stateCodeArray = true                   // display the statecode field
                recipient.state_code = undefined        // re-set the `state-code` field value
                clearLocation()                         // clear all the other `location-geo` information
                return;
            }
        }
        stateCodeArray = false          // else keep the statecode field hidden;
        recipient.state_code = ''       // place the state-code values as NOT undefined, but rather empty to pass the check
        clearLocation()                 // clear other field options
    }

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
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
     * [✅ WORKING]
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
     * [✅ WORKING]
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
     * [✅ WORKING]
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * Porcess the Printful Order and 
     * Submit it for Review
    */
    async function processPrintfulOrder() {
        // if Stripe is Successful, process the Printful Order;
        showStripe = false; // close stripe modal,
        let finalOrderCreate: NewOrder = newOrder
        finalOrderCreate.shipping = shipPrice.id  // assign the shipping type option to the order,
        
        const _data = {
            method: 'POST',
            endpoint: `orders`,
            data: finalOrderCreate
        }
        const response = await post(`shop/printful`, _data)
        // console.log(response)
        goto('/shop')
    }

    let selected_Color: string = undefined
    let selected_Size: string = undefined
    let selected_ImageURLs: string[] = undefined
    let selected_ImagePos: number = 0

    let rerender: boolean = true
    
    // $: console.log('selected_Color', selected_Color)
    // $: console.log('selected_Size', selected_Size)

    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
     * [REACTIVE]
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * check if the selected color is changed, if so, 
     * change the image to the correct color (first item in array)
    */
    $: if (selected_Color != undefined) {

        // declaring the search target
        itemSizes = []
        let syncVariantArray = res.result.sync_variants

        // search for an occurance(s) of a item with this color, and assign the `preview` Object, to the image URL Preview,
        syncVariantArray.filter((variant) => {
            if (variant.further_variant_info.color == selected_Color) {
                // push the value of the size to the array;
                itemSizes.push(variant.further_variant_info.size)
            }
        })
        // initiate the function to get the item images
        getItemImages()
    } 
    
    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
     * [REACTIVE]
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * if both color & size of the item have been selected,
     * search for the target item with matching qualities and,
     * assign it to the `selected_item` value,
    */
    $: if (selected_Color != undefined && selected_Size != undefined) {
        // declaring the search target
        let syncVariantArray = res.result.sync_variants
        let found = false
        rerender = false
        // search for the respective selected item, that matches with the color & size
        // and declare it as the `selectedItem` variable
        syncVariantArray.find((variant) => { 
            // get the first occrance of the variant that:
            if (variant.further_variant_info.color == selected_Color 
                && variant.further_variant_info.size == selected_Size) { 
                selectedItem = variant                          // set the variant to equal this option
                selectedItem.quantity = itemQuantity            // set the quantity of the selected item
                temp_selectedItem = <SyncVariant> selectedItem  // set a temporary selected item
                found = true
            }
        })
        // if this variant was not found, reset;
        if (!found) {
            selected_Size = undefined
            selectedItem = undefined
            temp_selectedItem = undefined
        }
        setTimeout(async() => {
            rerender = true
        }, 0.1)
        // console.log('selectedItem', selectedItem)
    }

    // negative itemQuantity is NOT allowed;
    let minusBtnDisabled: boolean = true;
    $: if (selectedItem != undefined) {
        if (parseInt(selectedItem.retail_price) * selectedItem.quantity == 0) {
            minusBtnDisabled = true
        } else {
            minusBtnDisabled = false
        }
    }

    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
     * [MOTHER FUNCTION]
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * ~~~~~~~~~~~~~~~~~~~~
     * An ASYNC function to trigger
     * the callback to the Server/Backend
     * to retrive the files for the specific item
     * that match this item variants SKU ID;
    */
    async function getItemImages() {
        let syncVariantArray = res.result.sync_variants
        // extract and search for the correct images relate to the item selected;
        for (let variant of syncVariantArray) {
            // get the first item variant of this variant occurance, and its files for preview;
            if (variant.further_variant_info.color == selected_Color) {
                // assign returned array to the images array for `THIS` item;
                selected_ImageURLs = await getPreivewFiles(variant.sku)
                selected_ImagePos = 0
                break
            }
        }
    }

    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
     * [FETCH TO SERVER FUNCTION]
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * ~~~~~~~~~~~~~~~~~~~~
     * This is a fetch-to-the-server
     * function method that searches
     * for the correct data-files
     * to display to the user for
     * preview and slideshow
    */
    async function getPreivewFiles(skuId: string): Promise < string[] > {
        // returns a list of target matching Product Item SKU img/assets;
        const response = await post(`shop/file_retrieve`, {
            sku: skuId
        })
        return response
    }

    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * [✅ WORKING]
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * ~~~~~~~~~~~~~~~~~~~~
     * A simple decrease/increase toggle
     * value for the slideshow of the 
     * image for the item
    */
    function toggleImagePos(pos: number) {
        // check if the position is to increase the POS;
        if (pos == 1) {
            // check if the POS has reached the limit, thus revert the array of value flow;
            if ((selected_ImagePos + 1) == selected_ImageURLs.length) {
                selected_ImagePos = 0
                return
            }
            selected_ImagePos++
        } 
        // decrease the POSition value
        else if (pos == -1) {
            // check if the limit- (lowerbound) has been reached, thus revert;
            if (selected_ImagePos == 0) {
                selected_ImagePos = selected_ImageURLs.length - 1
                return
            }
            selected_ImagePos--
        }
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
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        MOBILE FIRST 
    ~~~~~~~~~~~~~~~~~~~~
    */

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
    #item-img-container {
        width: calc(100vw / (var(--mobile) / 340.88));
        height: calc(100vw / (var(--mobile) / 364.62));
        filter: drop-shadow(0px 4.10843px 4.10843px rgba(0, 0, 0, 0.25));
        border-radius: 10.2711px;
        background-color: var(--white);
        position: relative;
        overflow: hidden;
    }
    #item-img {
        width: inherit;
        height: 100%;
    }
    #image-counter {
        z-index: 10;
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 0px 0px 5px 5px;
        position: absolute;
        top: 0;
        /* left: calc(100vw / (var(--mobile) / 44)); */
        left: 0;
        padding: calc(100vw / (var(--mobile) / 6)) calc(100vw / (var(--mobile) / 11));
    }
    #image-preview-box {
        z-index: 10;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        background: #FF5555;
        border-radius: 0px 10px 0px 0px;
        padding: calc(100vw / (var(--mobile) / 5));
    } #image-preview-box img {
        margin-right: 4px;
    }
    .awaiting-image {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    #no-image-icon {
        width: calc(100vw / (var(--mobile) / 35.5));
        height: calc(100vw / (var(--mobile) / 25.5));
        margin-bottom: calc(100vw / (var(--mobile) / 18.5));
    }
    .toggle-slideshow {
        top: 0;
        bottom: 0;
        height: 100%;
        width: calc(100vw / (var(--mobile) / 44));

        position: absolute;
        border-radius: 2.5px 0px 0px 2.5px;
        transition: all 0.3s ease-in-out;

        display: flex;
        align-items: center;
        justify-content: center;
    } .toggle-slideshow:hover {
        background: rgba(0, 0, 0, 0.15);
    }
    #next.toggle-slideshow {
        right: 0;
    }
    #prev.toggle-slideshow {
        left: 0;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    form CSS STYLE
    */
    form {
        margin-top: calc(100vw / (var(--mobile) / 43.38));
    }
    form #ship-header {
        margin-top: calc(100vw / (var(--mobile) / 60));
        margin-bottom: calc(100vw / (var(--mobile) / 19.11));
    }
    form label p, form legend p {
        /* font-family: 'Roboto Slab'; */
        font-weight: bold;
        margin-bottom: calc(100vw / (var(--mobile) / 7.35));
    }
    /* form fieldset p {
        font-weight: bold;
        margin-bottom: calc(100vw / (var(--mobile) / 15));
    } */
    input[type='radio'] {
        width: calc(100vw / (var(--mobile) / 15));
        height: auto;
        margin-right: calc(100vw / (var(--mobile) / 7));
    }
    input[type='radio'].remove-checkbox {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }
    #item-colors-container {
        display: grid;
        /* gap: calc(100vw / (var(--desktop) / 55)); */
    }
    /* color-item-select CSS */
    .item-options-color-select-radio {
        /* height: calc(100vw / (var(--mobile) / 59)); */
        padding: calc(100vw / (var(--mobile) / 8)) calc(100vw / (var(--mobile) / 17));
        display: inline-block;
        cursor: pointer;
        position: relative;
    }
    .item-options-color-select-radio.selected-color {
        /* padding: calc(100vw / (var(--mobile) / 8)) calc(100vw / (var(--mobile) / 17)); */
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 2.5px;
        border: 2px solid;
        border-image: linear-gradient(180deg, #00FF75 40.91%, #00A3FF 100%);
        border-image-slice: 9;
    }
    .color-point {
        width: calc(100vw / (var(--mobile) / 56));
        height: 100%;
        margin-bottom: calc(100vw / (var(--mobile) / 6));
        background: #000000;
        top: 0;
        bottom: 0;
        right: 0;
        position: absolute;
    }
    /* size-item-select CSS */
    #item-sizes-container {
        display: grid;
        /* gap: calc(100vw / (var(--desktop) / 55)); */
        grid-template-columns: repeat(auto-fill, calc(100vw / (var(--mobile) / 76)));
        grid-template-rows: repeat(auto-fill, calc(100vw / (var(--mobile) / 41)));
        height: calc(100vw / (var(--mobile) / 82));
    }
    .item-options-size-select-radio {
        height: calc(100vw / (var(--mobile) / 41));
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .item-options-size-select-radio.selected-size {
        background: #37474F;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
    /* quantity-item-select CSS */
    input[type='number']#quantity-input {
        width: calc(100vw / (var(--mobile) / 49.2));
        height: calc(100vw / (var(--mobile) / 41));
        margin: 0 calc(100vw / (var(--mobile) / 5));

        background: #FFFFFF;
        border: 1.64px solid #E8E8E8;
        box-sizing: border-box;
        border-radius: 2.5px;
    }
    .item-quantity-select-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        align-items: stretch;
    }
    .quantity-btn {
        width: calc(100vw / (var(--mobile) / 41));
        height: calc(100vw / (var(--mobile) / 41));

        background: #37474F;
        border-radius: 2.5px;
        box-shadow: none;
    }
    /* quick price check */
    #price-container {
        margin-top: calc(100vw / (var(--mobile) / 35));
        width: fit-content;
        display: flex;
        align-items: stretch;
    }
    #price-check {
        padding-right: calc(100vw / (var(--mobile) / 13.5));
    } #price-check span {
        margin-left: calc(100vw / (var(--mobile) / 8));
    }
    /* in-stock OR not-container */
    #item-stock-container {
        border-left: 2.5px solid #DFDFDF;
        padding-left: calc(100vw / (var(--mobile) / 9));
        
        display: flex;
        white-space: nowrap;
        align-items: center;
    } #item-stock-container img {
        margin-left: calc(100vw / (var(--mobile) / 4.14));
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
        /* border-spacing: 50px 0; */
    }
    td {
        padding-bottom: calc(100vw / (var(--mobile) / 7.35)) ;
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
    final submissions
    */
    #checkout-btn {
        margin-top: calc(100vw / (var(--mobile) / 23));
        background-image: url('/assets/svg/white-card-vector.svg');
        background-size: calc(100vw / (var(--mobile) / 22.05)) calc(100vw / (var(--mobile) / 16.17));
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~
      RESPONSIVENESS:
    ~~~~~~~~~~~~~~~~~~~~
    */

    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST 
    ~~~~~~~~~~~~~~~~~~~~
    */

    /* 1025px is used to allow for IPad Pro to use the Tabler Version */
    @media only screen and (min-width: 1025px) {

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
        SHOP / 
        <br />
        <span class='color-primary s-22'> 
            { res.result.sync_product.name } 
        </span>
    </h2>
    <!-- 
    ~~~~~~~~~~~~~~~
    back-button to `shop` page -->
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
    item-variant-iamge -->
    {#if selected_ImageURLs}
        <div id='item-img-container'>
            <div id='image-counter'>
                <p class='s-12 bold'>
                    {selected_ImagePos + 1} / {selected_ImageURLs.length}
                    <span class='s-12 bols'> view - {selected_ImageURLs[selected_ImagePos][0]} </span>
                </p>
            </div>
            <img
                id='item-img'
                src='./assets/img/printful/{selected_ImageURLs[selected_ImagePos][1]}'
                alt=""
            />
            <div id='image-preview-box'>
                <img 
                    src='./assets/svg/camera-vector.svg'
                    alt=""
                />
                <span class='s-10 color-white bold'>
                    image preview 
                </span>
            </div>
            <div id='next' 
                class='toggle-slideshow'
                on:click={() => toggleImagePos(1)}>
                <img
                    src='./assets/svg/next-vector.svg'
                    alt=""
                />
            </div>
            <div id='prev' 
                class='toggle-slideshow'
                on:click={() => toggleImagePos(-1)}>
                <img
                    src='./assets/svg/back-vector.svg'
                    alt=""
                />
            </div>
        </div>
    {:else}
        <div id='item-img-container' class='awaiting-image'>
            <img
                id='no-image-icon'
                src='./assets/svg/no-image-vector.svg'
                alt="no-vector"
            />
            <p class='s-16 color-red'> 
                Please select an item 
                <br />
                option to preview image
            </p>
        </div>
    {/if}
    <!-- 
    ~~~~~~~~~~~~~~~
    form to fill out by the user -->
    <form autocomplete="off" on:submit|preventDefault={startStripe}>
        <!-- 
        ~~~~~~~~~~~~~~~
        SELECT COLOR -->
        <fieldset>
            <legend>
                <p class='s-18 bold'> Select Color </p>
            </legend>
            <div id='item-colors-container'>
                {#each itemColors as item}
                    <label class='item-options-color-select-radio'
                        class:selected-color={selected_Color == item[0]}>
                        <div class='color-point' style='background-color: {item[1]}' />
                        <input
                            name='selectcolor' 
                            class='remove-checkbox'
                            type='radio' 
                            bind:group={selected_Color} 
                            value={item[0]} 
                            required
                            />
                        <span class='s-14'>{item[0]}</span>
                    </label>
                {/each}
            </div>
        </fieldset>

        <hr />

        <!-- 
        ~~~~~~~~~~~~~~~
        SELECT SIZE -->
        <fieldset>
            <legend>
                <p class='s-18 bold'>Select Size</p>
            </legend>
            <div id='item-sizes-container'>
                {#each itemSizes as item}
                    {#if rerender}
                        <label class='item-options-size-select-radio'
                            class:selected-size={selected_Size == item}>
                            <input
                                class='remove-checkbox'
                                type=radio 
                                bind:group={selected_Size} 
                                name='selectSize'
                                value={item} 
                                required 
                                />
                            <span class={selected_Size == item ? 's-20 color-primary bold' : 's-20'}>{ item }</span>
                        </label>
                    {/if}
                {/each}
            </div>
        </fieldset>

        <hr />

        <!-- 
        ~~~~~~~~~~~~~~~
        SELECT QUANTITY -->
        <fieldset>
            <p class='s-18 bold' style='margin-bottom: 10px'>Select Quantity</p>
            <div class='item-quantity-select-container'>
                <button
                    class='quantity-btn'
                    type='button'
                    disabled={minusBtnDisabled}
                    on:click={() => itemQuantity--}> 
                    <span class='s-22 bold color-primary'> - </span>
                </button>
                <input 
                    type="number" 
                    name="quantity"
                    placeholder="1"
                    bind:value={itemQuantity}
                    id='quantity-input'
                    class='s-22'
                    required />
                <button 
                    class='quantity-btn'
                    type='button' 
                    on:click={() => itemQuantity++}> 
                    <span class='s-22 bold color-primary'> + </span>
                </button>
            </div>
        </fieldset>
        <!-- 
        ~~~~~~~~~~~~~~~
        SIMPLE PRICE TOTAL UP -->
        {#if selectedItem != undefined}
            <div>
                {#if (parseInt(selectedItem.retail_price) * selectedItem.quantity) == 0}
                    <div id='price-container'>
                        <div id='price-check'>
                            <p class='s-18 bold'> Sub-total 
                                <span class='s-14 color-red'>select quantity</span> 
                            </p>
                        </div>
                    </div>
                {:else}
                    <div id='price-container'>
                        <div id='price-check'>
                            <p class='s-18 bold color-secondary'> Sub-total
                                <span class='s-22 bold color-secondary'>£ {parseInt(selectedItem.retail_price) * selectedItem.quantity}</span>  
                            </p>
                        </div>
                        <div id='item-stock-container'>
                            <p class='s-14'> In stock </p>
                            {#if temp_selectedItem.further_variant_info.in_stock}
                                <img 
                                    id='in-stock-img'
                                    src='./assets/svg/in-stock-checkmark-vector.svg'
                                    alt=""
                                />
                            {:else}
                                <img 
                                    id='in-stock-img'
                                    src='./assets/svg/in-stock-error-vector.svg'
                                    alt=""
                                />
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
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
                        <p class='s-14'>...loading shipping options...</p>
                    {:then data}
                        {#each data.result as item}
                            <label style="display: flex;">
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
                    <p class='s-14 color-red'> please fill all fields for shipping</p>
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
                            <p class='s-22 bold m-b-10 color-red'>
                                Order Breakdown
                            </p>
                            <table>
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
                                            <p class='s-14 color-red'>
                                                please select shippment
                                            </p>
                                        {/if}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p class='s-16 bold color-secondary'>Quantity</p>
                                    </td>
                                    <td>
                                        <p class='s-16 color-secondary'>
                                            x{itemQuantity}
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
                                        <p class='s-16 bold color-secondary'>Delivery Time</p>
                                    </td>
                                    <td>
                                        {#if shipPrice != undefined }
                                            <p class='s-16 color-secondary'>
                                                {shipPrice.minDeliveryDays} - {shipPrice.maxDeliveryDays} Days
                                            </p>
                                        {:else}
                                            <p class='s-14 color-red'>
                                                please select shippment
                                            </p>
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
                        <hr />
                    </div>
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
            class='btn-blue btn-left-icon'
            type="submit">
            <p class='s-18'>
                PROCEED TO CHECKOUT
            </p>
        </button>
    </form>
</section>