<!-- ===================
	COMPONENT JS - MODULE 
    [TypeScript Written]
=================== -->

<script context="module" lang='ts'>
    import { post } from '../../../utils/init.js'
    import type { Preload } from "@sapper/common"

    /**
     * Descrption:
     * ~~~~~~~~~~~~~~~~~~~~
     * This function / method preloads
     * with the loading web-page 
     * 
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
            console.log('not in production!')
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

        // return these pieces of data as `export let ...`
        return {
            res, 
        }
    }
</script>

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { cart } from "../../../stores/basket.js";
    import { fade } from 'svelte/transition';

    import type { SyncVariant, responseListProductVariants } from '../../../models/printful/proucts_printful'
    import type { Item } from '../../../models/printful/orders_printful'
    import type { ResponseVariant, ResponseAllProductVariant } from '../../../models/printful/printful-catalog-api'

    import AddedCartModel from "./_AddedCartModel.svelte";

    export let res: responseListProductVariants

    let varaintsArray = res.result.sync_variants // declare item properties, & options;

    // declare item colors (no-duplicates);
    const mapColors = new Map()
    varaintsArray.map(variant => {
        mapColors.set(variant.further_variant_info.color, variant.further_variant_info.color_code)
        return
    })
    const itemColors = Array.from(mapColors)

    // declare item sizes (no-duplicates);
    const itemSizesArray = varaintsArray.map(variant => variant.further_variant_info.size)
    let itemSizes = Array.from(new Set(itemSizesArray))
    
    let temp_selectedItem: SyncVariant = undefined
    let selectedItem: Item = undefined          // contains the selected option/item of merch

    let itemQuantity: number = undefined        // item quantity
    $: if (selectedItem != undefined && itemQuantity != itemQuantity) {
        selectedItem.quantity = itemQuantity    // setting the quantity as an instantiating value
    }
    
    let selected_Color: string = undefined
    let selected_Size: string = undefined
    let selected_ImageURLs: string[] = undefined
    let selected_ImagePos: number = 0

    let rerender: boolean = true
    
    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * ~~~~~~~~~~~~
     * check if the selected color is changed, if so, 
     * change the image to the correct color (first item in array)
    */
    $: if (selected_Color != undefined) {
        // ~~~~~~~~~~
        // empty the sizes list Array;
        itemSizes = []
        // ~~~~~~~~~~
        // declaring the search target;
        let syncVariantArray = res.result.sync_variants
        // ~~~~~~~~~~
        // search for an occurance(s) of a item with `this` color, 
        syncVariantArray.filter((variant) => {
            // if color of this variant matches;
            if (variant.further_variant_info.color == selected_Color) {
                // push the value of the size to the array;
                itemSizes.push(variant.further_variant_info.size)
            }
        })
        // ~~~~~~~~~~
        // get local/static images for `this` variant
        getItemImages()
    } 
    
    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * ~~~~~~~~~~~~
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
    $: if (itemQuantity != undefined) {
        if (itemQuantity == 0) {
            minusBtnDisabled = true
        } else {
            minusBtnDisabled = false
        }
    }

    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * @param val
    */
    function changeQty(val: number) {
        if (itemQuantity == undefined && val == 1) {
            itemQuantity = 1
        } else if (itemQuantity == undefined && val == -1) {
            itemQuantity = undefined
        } else {
            itemQuantity += val
        }
    }

    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~
     * Description:
     * ~~~~~~~~~~~~
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
     * Description:
     * ~~~~~~~~~~~~
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
     * Description:
     * ~~~~~~~~~~~~
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

    /**
     * Function / Method;
     * ~~~~~~~~~~~~~~~~~~~~~
     * Description:
     * ~~~~~~~~~~~~
     * Add `this` item to the 
     * .localStorage()
     * & the SvelteJs Stores for
     * persistance;
    */
    let showModalAddToCart: boolean = false;

    function addItemToBasket() {
        // check if quantity has been selected;
        if ((selectedItem.quantity == 0) || (selectedItem.quantity == undefined)) {
            alert('uh-oh! you need to select item quantity')
            return
        } else if (selected_Color == undefined) {
            alert('uh-oh! you need to select item color')
        } else if (selected_Size == undefined) {
            alert('uh-oh! you need to select item size')
        }
        // alert('Item has bee successfully added to your basket!')
        showModalAddToCart = true;
        setTimeout(async() => {
            showModalAddToCart = false;
        }, 3500);
        cart.addToCart(selectedItem)
    }
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- adding SEO title and meta-tags to the /basket page -->
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
	<meta property="og:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
    <!--
    ~~~~~~~~~~~~
	Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.enucs.org.uk/shop">
    <meta property="twitter:title" content="ENUCS | Shop { res.result.sync_product.name }">
    <meta property="twitter:description" content="Computing Society | ENUCS | Merchandise Shop">
	<meta property="twitter:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
</svelte:head>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        MOBILE FIRST 
    */
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    back-btn CSS STYLE
    */
    #back-to-shop {
        background-image: url('/assets/svg/back-arrow-icon.svg');
        background-position: left 0 top 50%;
        background-size: contain;
        padding: 5px 6px 5px 50px !important;
        margin: calc(100vw / (var(--mobile) / 32)) 0 calc(100vw / (var(--mobile) / 43)) 0;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    item image CSS STYLE
    */
    #item-img-container {
        width: calc(100vw / (var(--mobile) / 340.88));
        height: calc(100vw / (var(--mobile) / 364.62));
        border-radius: 10.2711px;
        /* const. */
        box-shadow: 0px 0px 7.5px rgb(0 0 0 / 25%);
        background-color: var(--white);
        position: relative;
    }
    #item-img {
        width: inherit;
        height: 100%;
        /* const. */
    }
    #image-info {
        /* const. */
        position: absolute;
        top: 100%;
    }
    #image-counter {
        padding: calc(100vw / (var(--mobile) / 6)) calc(100vw / (var(--mobile) / 11));
        border-radius: 0 10.2711px 0 0;
        /* const. */
        z-index: 1;
        position: absolute;
        right: 0%;
        top: 0%;
        background: var(--secondary);
        width: fit-content;
    } #image-preview-box {
        background-image: url('/assets/svg/camera-vector.svg');
        background-repeat: no-repeat;
    }
    #no-image-icon {
        width: calc(100vw / (var(--mobile) / 35.5));
        height: calc(100vw / (var(--mobile) / 25.5));
        margin-bottom: calc(100vw / (var(--mobile) / 18.5));
    }
    .toggle-slideshow {
        width: calc(100vw / (var(--mobile) / 44));
        border-radius: 2.5px 0px 0px 2.5px;
        /* const. */
        top: 0;
        bottom: 0;
        height: 100%;
        position: absolute;
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
    } .toggle-slideshow:hover {
        background: rgba(0, 0, 0, 0.15);
    } #next.toggle-slideshow {
        right: 0;
        border-radius: 0 10.2711px 10.2711px 0;
    } #prev.toggle-slideshow {
        left: 0;
        border-radius: 10.2711px 0 0 10.2711px;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    form CSS STYLE
    */
    form {

    } form label p, 
      form legend p {
        font-weight: bold;
        margin-bottom: calc(100vw / (var(--mobile) / 7.35));

    } form input[type='radio'] {
        width: calc(100vw / (var(--mobile) / 15));
        height: auto;
        margin-right: calc(100vw / (var(--mobile) / 7));

    } form input[type='radio'].remove-checkbox {
        position: absolute;
        opacity: 0;
        pointer-events: none;

    }
    
    #item-colors-container {
        display: grid;
        gap: 2.5px;
        /* gap: calc(100vw / (var(--desktop) / 55)); */

    }
    /* color-item-select CSS */
    .item-options-color-select-radio {
        /* height: calc(100vw / (var(--mobile) / 59)); */
        padding: calc(100vw / (var(--mobile) / 8)) calc(100vw / (var(--mobile) / 17));
        display: inline-block;
        cursor: pointer;
        position: relative;
        border: 2px solid transparent;

    }
    .item-options-color-select-radio.selected-color, 
    .item-options-color-select-radio:hover {
        /* padding: calc(100vw / (var(--mobile) / 8)) calc(100vw / (var(--mobile) / 17)); */
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 2.5px;
        border: 2px solid;
        border-image: linear-gradient(180deg, #00FF75 40.91%, #00A3FF 100%);
        border-image-slice: 9;
        transition: all 0.25s ease-in;

    }
    .color-point {
        width: calc(100vw / (var(--mobile) / 56));
        height: 100%;
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
    .item-options-size-select-radio.selected-size,
    .item-options-size-select-radio:hover {
        transition: all 0.25s ease-in;
        background: #37474F;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    }
    .item-options-size-select-radio:hover span {
        font-style: normal;
        font-weight: bold;
        color: #FF5555;
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
        -moz-appearance: textfield;

    }
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;

    }
    .quantity-btn {
        width: calc(100vw / (var(--mobile) / 41));
        height: calc(100vw / (var(--mobile) / 41));
        /* const. */
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

    } #item-stock-container img {
        margin-left: calc(100vw / (var(--mobile) / 4.14));

    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
    table CSS STYLE (ORDER INFO)
    */
    hr {
        width: calc(100vw / (var(--mobile) / 314.54));
        margin: calc(100vw / (var(--mobile) / 16.17)) 0;
        /* const */
        opacity: 0.25;
        border: 1.46983px solid #FF5555;
        background-color: #FF5555;
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~
    final submissions
    */
    #add-to-cart-btn {
        background-image: url('/assets/svg/shop-add-to-cart-vector.svg');
        background-size: calc(100vw / (var(--mobile) / 22.05)) calc(100vw / (var(--mobile) / 21));
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        TABLET FIRST STYLE 
        767px is used to allow for IPad to use the Tablet Version
    */
    @media only screen and (min-width: 767px) {
        /*
        ~~~~~~~~~~~~~~~~~~~~
        form-container for the item image & form
        */
        #form-cotaienr {
            position: relative;
            display: grid;
            justify-content: space-between;
            gap: 40px;
            flex-direction: row;
            align-items: flex-start;
            grid-template-columns: 1fr 1fr;
        }
        /* 
        ~~~~~~~~~~~~~~~~~~~~
        item image CSS STYLE & image container
        */
        #item-img-container {
            height: calc(100vw / (var(--tablet) / 336));
            width: calc(100vw / (var(--tablet) / 335.28));
        }
        .toggle-slideshow {
            width: calc(100vw / (var(--tablet) / 44));
        }
        #image-counter {
            padding: calc(100vw / (var(--tablet) / 6)) calc(100vw / (var(--tablet) / 11));
        }
        #image-preview-box {
            padding: calc(100vw / (var(--tablet) / 5));
        }
        /* 
        ~~~~~~~~~~~~~~~~~~~~
        form CSS STYLE
        */
        form {
            margin-top: 0;
            
        } 
        form label p, 
        form legend p {
            margin-bottom: calc(100vw / (var(--tablet) / 7.35));

        } form input[type='radio'] {
            width: calc(100vw / (var(--tablet) / 15));
            margin-right: calc(100vw / (var(--tablet) / 7));

        } form input[type='number']#quantity-input {
            width: calc(100vw / (var(--tablet) / 49.2));
            height: calc(100vw / (var(--tablet) / 41));
            margin: 0 calc(100vw / (var(--tablet) / 5));

        }
        /* 
        ~~~~~~~~~~~~~~~~~~~~
        divider-style
        */
        hr {
            width: 100%;
            margin: calc(100vw / (var(--tablet) / 16.17)) 0;
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        item-color-container-list */
        .item-options-color-select-radio {
            padding: calc(100vw / (var(--tablet) / 8)) calc(100vw / (var(--tablet) / 17));
        }
        .color-point {
            height: 100%;
            width: calc(100vw / (var(--tablet) / 39.45));
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        item-sizes-cotaier-grid 
        */
        #item-sizes-container {
            grid-template-columns: repeat(auto-fill, calc(100vw / (var(--tablet) / 76)));
            grid-template-rows: repeat(auto-fill, calc(100vw / (var(--tablet) / 41)));
            height: calc(100vw / (var(--tablet) / 82));
        }
        .item-options-size-select-radio {
            height: calc(100vw / (var(--tablet) / 41));
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        page-buttons 
        */
        .quantity-btn {
            width: calc(100vw / (var(--tablet) / 41));
            height: calc(100vw / (var(--tablet) / 41));
        }
        #add-to-cart-btn {
            background-size: calc(100vw / (var(--tablet) / 22.05)) calc(100vw / (var(--tablet) / 16.17));
        }
        #back-to-shop {
            padding: 5px 6px 5px 50px !important;
            background-position: left 0 top 50%;
            margin: calc(100vw / (var(--tablet) / 32)) 0 calc(100vw / (var(--tablet) / 43)) 0;
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        price container */
        #price-container {
            margin-top: calc(100vw / (var(--tablet) / 35));
        }
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST STYLE 
        1025px is used to allow for IPad Pro to use the Tablet Version
    */
    @media only screen and (min-width: 1025px) {
        /*
        ~~~~~~~~~~~~~~~~~~~~
        form-container for the item image & form
        */
        #form-cotaienr {
            gap: 70px;
        }
        /* 
        ~~~~~~~~~~~~~~~~~~~~
        item image CSS STYLE & image container
        */
        #item-img-container {
            height: calc(100vw / (var(--desktop) / 414.11));
            width: calc(100vw / (var(--desktop) / 415));
        }
        .toggle-slideshow {
            width: calc(100vw / (var(--desktop) / 44));
            cursor: pointer;
        } 
        #image-counter {
            padding: calc(100vw / (var(--desktop) / 6)) calc(100vw / (var(--desktop) / 11));
        }
        #image-preview-box {
            padding: calc(100vw / (var(--desktop) / 5));
        }
        /* 
        ~~~~~~~~~~~~~~~~~~~~
        form CSS STYLE
        */
        form {
            margin-top: 0;
            
        } 
        form label p, 
        form legend p {
            margin-bottom: calc(100vw / (var(--desktop) / 7.35));

        } form input[type='radio'] {
            width: calc(100vw / (var(--desktop) / 15));
            margin-right: calc(100vw / (var(--desktop) / 7));

        } form input[type='number']#quantity-input {
            width: calc(100vw / (var(--desktop) / 49.2));
            height: calc(100vw / (var(--desktop) / 41));
            margin: 0 calc(100vw / (var(--desktop) / 5));

        }
        /* 
        ~~~~~~~~~~~~~~~~~~~~
        divider-style
        */
        hr {
            width: 100%;
            margin: calc(100vw / (var(--desktop) / 16.17)) 0;
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        item-color-container-list */
        .item-options-color-select-radio {
            padding: calc(100vw / (var(--desktop) / 8)) calc(100vw / (var(--desktop) / 17));
        }
        .color-point {
            height: 100%;
            width: calc(100vw / (var(--desktop) / 39.45));
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        item-sizes-cotaier-grid 
        */
        #item-sizes-container {
            grid-template-columns: repeat(auto-fill, calc(100vw / (var(--desktop) / 76)));
            grid-template-rows: repeat(auto-fill, calc(100vw / (var(--desktop) / 41)));
            height: calc(100vw / (var(--desktop) / 82));
        }
        .item-options-size-select-radio {
            height: calc(100vw / (var(--desktop) / 41));
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        page-buttons 
        */
        .quantity-btn {
            width: calc(100vw / (var(--desktop) / 41));
            height: calc(100vw / (var(--desktop) / 41));
        } .quantity-btn:hover {
            background-color: var(--white);
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
            color: var(--secondary);
        }
        #add-to-cart-btn {
            background-size: calc(100vw / (var(--desktop) / 22.05)) calc(100vw / (var(--desktop) / 16.17));
        }
        #add-to-cart-btn:hover {
            background-image: url('/assets/svg/shop-add-to-cart-hover-vector.svg');
        }
        #back-to-shop {
            background-position: left 0 top 50%;
            margin: calc(100vw / (var(--desktop) / 32)) 0 calc(100vw / (var(--desktop) / 43)) 0;
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        price container */
        #price-container {
            margin-top: calc(100vw / (var(--desktop) / 35));
        }

        /* 
        ~~~~~~~~~~~~~~~~~~~~
        hover-effects */
        #back-to-shop:hover {
            background-image: url('/assets/svg/back-arrow-icon-hover.svg');
            background-color: var(--secondary);
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if showModalAddToCart}
    <AddedCartModel />
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
            <p class='s-18'>
                BACK TO SHOP
            </p>
        </button>
    </a>
    <!-- 
    ~~~~~~~~~~~~~~~
    dynamic form and single product view START -->
    <div id='form-cotaienr'>
        <!--
        ~~~~~~~~~~~~~~~
        item-variant-iamge -->
        {#if selected_ImageURLs}
            <div id='item-img-container' in:fade>
                <div id='image-counter'>
                    <p class='s-12 bold color-white'>
                        {selected_ImagePos + 1} / {selected_ImageURLs.length}
                    </p>
                </div>
                <img
                    id='item-img'
                    src='./assets/img/printful/{selected_ImageURLs[selected_ImagePos][1]}'
                    alt=""
                />
                <!-- image slide-navigation (next) -->
                <div id='next' 
                    class='toggle-slideshow'
                    on:click={() => toggleImagePos(1)}>
                    <img
                        src='./assets/svg/next-vector.svg'
                        alt=""
                    />
                </div>
                <!-- image slide-navigation (prev) -->
                <div id='prev' 
                    class='toggle-slideshow'
                    on:click={() => toggleImagePos(-1)}>
                    <img
                        src='./assets/svg/back-vector.svg'
                        alt=""
                    />
                </div>
                <div id='image-info' 
                    class='m-t-15 row-space-even'>
                    <button id='image-preview-box'
                        class='btn-secondary btn-left-icon' disabled>
                        <p class='s-12 color-white bold'>
                            image preview 
                        </p>
                    </button>
                    <button class='btn-secondary' disabled>
                        <p class='s-12 bold uppercase'> view | {selected_ImageURLs[selected_ImagePos][0]} </p>
                    </button>
                </div>
            </div>
        {:else}
            <div id='item-img-container' class='column-space-center'>
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
        <form on:submit|preventDefault={addItemToBasket} 
            class='m-t-80'>
            <!-- 
            ~~~~~~~~~~~~~~~
            SELECT COLOUR -->
            <fieldset>
                <legend>
                    <p class='s-18 bold'> Select Colour </p>
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
                <div class='row-space-start'>
                    <button
                        class='quantity-btn'
                        type='button'
                        disabled={minusBtnDisabled}
                        on:click={() => changeQty(-1)}> 
                        <span class='s-22 bold color-primary'> - </span>
                    </button>
                    <input 
                        type="number" 
                        name="quantity"
                        placeholder="0"
                        bind:value={itemQuantity}
                        id='quantity-input'
                        class='s-22'
                        required disabled />
                    <button 
                        class='quantity-btn'
                        type='button' 
                        on:click={() => changeQty(+1)}> 
                        <span class='s-22 bold color-primary'> + </span>
                    </button>
                </div>
            </fieldset>

            <!-- 
            ~~~~~~~~~~~~~~~
            SIMPLE PRICE TOTAL UP -->
            {#if selectedItem != undefined}
                <div>
                    {#if (selectedItem.quantity == 0) || (selectedItem.quantity == undefined)}
                        <div id='price-container'>
                            <div id='price-check'>
                                <p class='s-18 bold no-wrap'> 
                                    Sub-total 
                                </p>
                            </div>
                            <div class='row-space-start'>
                                <img 
                                    class='m-r-5'
                                    src='./assets/svg/exclamation-vector.svg'
                                    alt=''
                                />
                                <p class='s-12 color-red bold'>
                                    quantity not selected
                                </p>
                            </div>
                        </div>
                    {:else}
                        <div id='price-container'>
                            <div id='price-check'>
                                <p class='s-18 bold color-secondary no-wrap'> Sub-total
                                    <span class='s-22 bold color-secondary'>£ {parseInt(selectedItem.retail_price) * selectedItem.quantity}</span>  
                                </p>
                            </div>
                            <div id='item-stock-container' class='row-space-start'>
                                {#if temp_selectedItem.further_variant_info.in_stock}
                                    <p class='s-14 no-wrap'> In stock </p>
                                    <img 
                                        id='in-stock-img'
                                        src='./assets/svg/in-stock-checkmark-vector.svg'
                                        alt=""
                                    />
                                {:else}
                                    <p class='s-14 no-wrap'> Not in stock </p>
                                    <img 
                                        id='in-stock-img'
                                        src='./assets/svg/in-stock-error-vector.svg'
                                        alt=""
                                    />
                                {/if}
                            </div>
                        </div>
                        <p class='s-10 bold color-secondary'>Not including shipping & VAT</p>
                    {/if}
                </div>
            {/if}

            <!-- 
            ~~~~~~~~~~~~~~~
            CHECKOUT STRIPE OPEN -->
            <button 
                id='add-to-cart-btn'
                class='btn-blue btn-left-icon m-t-20'
                type="submit">
                <p class='s-18'>
                    ADD ITEM TO CART
                </p>
            </button>
        </form>
    </div>
</section>