<script lang='ts'>
    import { get } from '../api/printful'
    import type { 
        SyncProduct, 
        responseListProductVariants, 
        SyncVariant,
    } from '../api/modals/proucts_printful'

    export let data : SyncProduct

    /**
     * Description:
     * Load Extra Information about the product;
    */
    async function getFurtherInfo() : Promise<responseListProductVariants> {
        const response = await get(`store/products/${data.id}`)
        // if (process.env.NODE_ENV != 'production') { console.log('MerchCard.svelte', response) } // test-dev

        // extract the min-max price in the form of an array;
        getMinMaxRetailPrice(response.result.sync_variants)

        // extract the currency for the merchandise (1st Variation is enough)
        getItemCurrency(response.result.sync_variants[0].currency)

        // pass the response to the HTML;
        return response
    }
    let promise = getFurtherInfo()

    let currency: string
    /**
     * Description:
     * Assings a `currecny` used to pay for the item
     * 
     * @param currecyType
    */
    function getItemCurrency(currecyType: string) {
        currency = currecyType
    }
    
    let priceRange: [
        n0: number,
        n1: number
    ]
    /**
     * Description:
     * Main Method Handler for obtaining
     * the MinMax Retail Price of the Clothes
     * 
     * @param arr
    */
    function getMinMaxRetailPrice(arr: Array<SyncVariant>) {
        let processedArray = extractRetailPriceToArray(arr)
        priceRange = getMinMaxWithMath(processedArray)
    }

    /**
     * Description:
     * Gets all of the prices for `this` clothing,
     * and places the values in an array `number[]`
     * ready to be calculated by getMinMaxWithMath()
     * 
     * @param arr
    */
    function extractRetailPriceToArray(arr: Array<SyncVariant>) {
        // test-dev
        // if (process.env.NODE_ENV != 'production') { console.log('MerchCard.svelte', arr) }
        let valueArray = []
        let price: number

        arr.forEach(element => {
            // test-dev;
            // if (process.env.NODE_ENV != 'production') { console.log('MerchCard.svelte', element.retail_price) }
            // convert string to float;
            price = parseFloat(element.retail_price)
            // add the value to the array;
            valueArray.push(price)
        });
        // test-dev
        // if (process.env.NODE_ENV != 'production') { console.log('MerchCard.svelte', valueArray) }

        return valueArray
    }

    
    /**
     * Description:
     * Gets the min. / max. merchendaise
     * prices from a generated array
     * 
     * @param arr
    */
    function getMinMaxWithMath(arr: number[]): [n0: number, n1: number] {
        // Math.max(10,3,8,1,33)
        let maximum: number = Math.max(...arr)

        // Math.min(10,3,8,1,33)
        let minimum: number = Math.min(...arr)

        let result: [n0: number, n1: number] = ([minimum, maximum]) 

        // test-dev
        // if (process.env.NODE_ENV != 'production') { console.log('MerchCard.svelte', result) }

        return result
    };
</script>

<!-- 
~~~~~~~~~~~~
	COMPONENT STYLE
    + DESKTOP OPTIMIZED
~~~~~~~~~~~~
-->

<style>
    /*
    ~~~~~~~~~~~~~~~~~~~~
    merch-card-container-style-on:hover
    */
    .merch-container {
        width: auto;
        height: 100%;
        /* 
        constant values */
        display: grid;
        background-color: var(--white);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        position: relative;
        overflow: hidden;
    }
    /*
    ~~~~~~~~~~~~~~~~~~~~
    card-info-container-style
    */
    .merch-info-container {
        padding: calc(100vw / 15.625) calc(100vw / 15.625) calc(100vw / 7.7736318408) calc(100vw / 15.625);
    }
    .item-price-container {
        padding: calc(100vw / 37.5) calc(100vw / 28.8461538462);
        /* 
        constant values */
        border-radius: 9.12966px 0px 0px 0px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: var(--black);
    } .item-price-container span {
        color: var(--white);
    }
    img.merch-img {
        width: calc(100vw / 1.11315601995);
        height: calc(100vw / 1.44136526118);
        object-fit: cover;
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

        /*
        ~~~~~~~~~~~~~~~~~~~~
        merch-card-container-style-on:hover
        */
        .merch-container:hover {
            background-color: #37474F;
            transition: all 0.25s ease;
        } .merch-container:hover p {
            color: #FFFFFF;
            transition: all 0.25s ease;
        } .merch-container:hover .item-price-container {
            background-color: #FFFFFF;
            transition: all 0.25s ease;
        } .merch-container:hover .item-price-container span {
            color: #37474F;
            transition: all 0.25s ease;
        }
        /*
        ~~~~~~~~~~~~~~~~~~~~
        card-info-container-style
        */
        .merch-info-container {
            padding: calc(100vw / 68.5714285714) calc(100vw / 68.5714285714) calc(100vw / 33.1110600138) calc(100vw / 68.5714285714);
        }
        img.merch-img {
            width: calc(100vw / 4.75247524752);
            height: calc(100vw / 6.15384615385);
            object-fit: cover;
        }
        .item-price-container {
            padding: calc(100vw / 175.182481752) calc(100vw / 102.857142857);
        }
    }
</style>

<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
~~~~~~~~~~~~
-->

{#await promise}
        <p>...Loading Item...</p>
{:then data}
    <a rel=prefetch 
        href="/shop/{data.result.sync_product.id}"
        >
        <div class='merch-container'>
            <img 
                src={ data.result.sync_product.thumbnail_url }
                alt={ data.result.sync_product.name }
                class='merch-img'
            />
            <div class='merch-info-container'>
                <p class='s-22 bold'>
                    { data.result.sync_product.name }
                </p>
                <div class='item-price-container s-14 bold'>
                    <span> { currency }</span>
                    <span> { priceRange[0] }</span>
                    <span> - </span>
                    <span> { priceRange[1] }</span>
                </div>
            </div>
        </div>
    </a>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
