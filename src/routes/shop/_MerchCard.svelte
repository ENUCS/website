<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { post } from '../../utils/init.js'

    import { createEventDispatcher } from 'svelte'
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import ContentLoader from 'svelte-content-loader'

    import type { SyncProduct, responseListProductVariants, SyncVariant } from '../../models/printful/proucts_printful'
    import type { ContentLoaderProps } from '../../models/content-loader-interface'

    const dispatch = createEventDispatcher()

    // data passed into the component from parent;
    export let data : SyncProduct

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Load Extra Information about 
     * the product.
     * 
     * Targeting the ability to
     * get the range of prices for
     * each `product variant`.
     * 
     * @returns Promise<responseListProductVariants>
    */
    async function getFurtherInfo() : Promise<responseListProductVariants> {
        const _data = {
            method: 'GET',
            endpoint: `store/products/${data.id}`
        }
		const response = await post(`shop/printful`, _data)
        // extract the min-max price in the form of an array;
        getMinMaxRetailPrice(response.result.sync_variants)
        // extract the currency for the merchandise (1st Variation is enough)
        getItemCurrency(response.result.sync_variants[0].currency)
        // pass the response to the HTML;
        return response
    }
    let promise = getFurtherInfo()
    
    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Assings a `currecny` used to 
     * pay for the item
     * 
     * @param currecyType
    */
    let currency: string
    function getItemCurrency(currecyType: string) {
        currency = currecyType
    }

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Main Method Handler for obtaining
     * the Min & Max Retail Price of the Item Merch
     * variants
     * 
     * @param arr
    */
    let priceRange: [
        n0: number,
        n1: number
    ]
    function getMinMaxRetailPrice(arr: Array<SyncVariant>) {
        let processedArray = extractRetailPriceToArray(arr)
        priceRange = getMinMaxWithMath(processedArray)
    }

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Gets all of the prices for `this` clothing,
     * and places the values in an array `number[]`
     * ready to be calculated by getMinMaxWithMath()
     * 
     * @param arr
     * @returns number[]
    */
    function extractRetailPriceToArray(arr: Array<SyncVariant>): number[] {
        let valueArray = []
        let price: number

        // iterate over the array of items, and extract their `retail_prices` into
        // a new array
        arr.forEach(element => {
            // convert string to float;
            price = parseFloat(element.retail_price)
            // add the value to the array;
            valueArray.push(price)
        });

        // return this new array of prices
        return valueArray
    }
    
    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Gets the min. / max. merchendaise
     * prices from a generated array
     * 
     * @param arr
     * @returns Array<number_1, number_2>
    */
    function getMinMaxWithMath(arr: number[]): [n0: number, n1: number] {
        // Math.max(10,3,8,1,33)
        let maximum: number = Math.max(...arr)
        // Math.min(10,3,8,1,33)
        let minimum: number = Math.min(...arr)
        // final result value of [min, max]
        let result: [n0: number, n1: number] = ([minimum, maximum]) 

        // test-dev
        // if (process.env.NODE_ENV != 'production') { console.log('MerchCard.svelte', result) }

        return result
    };

    /**
     * Decalring the ContentLoaderProps
     * values through the interface 
    */
    let contentLoaderProps: ContentLoaderProps = {
        width: `100%`,
        height: `100%`,
        primaryColor: '#f9f9f9'
    }

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * A component event trigger
     * that triggers in the PARENT
     * component an event; in this case
     * the event `on:loading`.
    */
    function onClick() {
        dispatch('loading')
    }
</script>

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
    merch-card-container-style
    */
    #merch-container-loader {
        height: calc(100vw / (var(--mobile) / 360.35));
        background-color: transparent;
        display: flex;
    }
    .merch-container {
        width: auto;
        height: 100%;
        /* 
        constant values */
        display: grid;
        background-color: #f3f3f4;
        box-shadow: 0px 0px 7.5px rgb(0 0 0 / 25%);
        border-radius: 10px;
        position: relative;
        overflow: hidden;
    } a .merch-container:active {
        background-color: var(--primary);
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~
    card-info-container-style
    */
    .merch-info-container {
        padding: calc(100vw / (var(--mobile) / 15)) calc(100vw / (var(--mobile) / 24)) calc(100vw / (var(--mobile) / 42.5)) calc(100vw / (var(--mobile) / 24))
    }
    .item-price-container {
        padding: calc(100vw / (var(--mobile) / 9.5)) calc(100vw / (var(--mobile) / 14));
        /* 
        constant values */
        border-radius: 9.12966px 0px 0px 0px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: var(--primary);
    } .item-price-container span {
        color: var(--white);
    }
    img.merch-img {
        height: calc(100vw / (var(--mobile) / 260));
        /* 
        constant values */
        width: 100%;
        object-fit: contain;
        background-color: white;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        TABLET FIRST 
    */
    @media only screen and (min-width: 768px) {
        /*
        ~~~~~~~~~~~~~~~~~~~~
        card-info-container-style
        */
        #merch-container-loader {
            height: calc(100vw / (var(--tablet) / 324.1));
        }
        .merch-info-container {
            padding: calc(100vw / (var(--tablet) / 20.7)) calc(100vw / (var(--tablet) / 20.7)) calc(100vw / (var(--tablet) / 43.7)) calc(100vw / (var(--tablet) / 20.7));
        }
        img.merch-img {
            height: calc(100vw / (var(--tablet) / 234));
        }
        .item-price-container {
            padding: calc(100vw / (var(--tablet) / 8.22)) calc(100vw / (var(--tablet) / 14.5));
        }
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST 
    */
    @media only screen and (min-width: 1024px) {
        /*
        ~~~~~~~~~~~~~~~~~~~~
        merch-card-container-style-on:hover
        */
        a .merch-container:active,
        a .merch-container:hover {
            background-color: var(--primary);
            transition: all 0.25s ease;
        } .merch-container:hover p {
            color: var(--white);
            transition: all 0.25s ease;
        } .merch-container:hover .item-price-container {
            background-color: var(--secondary);
            transition: all 0.25s ease;
        } .merch-container:hover .item-price-container span {
            color: var(--white);
            transition: all 0.25s ease;
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        card-info-container-style
        */
        #merch-container-loader {
            height: calc(100vw / (var(--desktop) / 298));
        }
        .merch-info-container {
            padding: calc(100vw / (var(--desktop) / 20.72)) calc(100vw / (var(--desktop) / 20.72)) calc(100vw / (var(--desktop) / 43.49) )calc(100vw / (var(--desktop) / 20.72));
        }
        img.merch-img {
            height: calc(100vw / (var(--desktop) / 234));
        }
        .item-price-container {
            padding: calc(100vw / (var(--desktop) / 8.5)) calc(100vw / (var(--desktop) / 14));
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

{#await promise}
    <div id='merch-container-loader' 
        class='merch-container'> 
        <ContentLoader {...contentLoaderProps} />
    </div>

{:then data}
    <a rel=prefetch
        href="/shop/{data.result.sync_product.id}"
        in:fade >
        <div class='merch-container' on:click={() => onClick()}>
            <img 
                src={ data.result.sync_product.thumbnail_url }
                alt={ data.result.sync_product.name }
                class='merch-img'
            />
            <div class='merch-info-container'>
                <p class='s-20 bold color-secondary'>
                    { data.result.sync_product.name }
                </p>
                <div class='item-price-container s-14 bold'>
                    <span> { priceRange[0] }</span>
                    <span> - </span>
                    <span> { priceRange[1] }</span>
                    <span> { currency }</span>
                </div>
            </div>
        </div>
    </a>

{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
