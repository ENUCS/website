<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { post } from '../../utils/init.js'
    import type { responseListItems } from '../../models/printful/proucts_printful'
    import MerchContainer from './_MerchCard.svelte'
    import LoadingModel from '../../components/_LoadingModel.svelte'
    import { fade } from 'svelte/transition';

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Load the available products
     * from the Printful API using the
     * project PROXY on the backend
     * 
     * @return Promise<responseListItems>
    */
    async function getPrintfulShopItems(): Promise< responseListItems > {
        const data = {  // data to be passed to the PROXY
            method: 'GET',
            endpoint: `store/products`
        }
		const res = await post(`shop/printful`, data)
        // if (process.env.NODE_ENV != 'production') { console.info('shop-index.svelte', res) } // test-dev
        return res
	}
	let promise = getPrintfulShopItems()

    let loading: boolean = false
    function initLoading() {
        loading = true
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
    #merch-grid {
        display: grid;
        gap: calc(100vw / (var(--mobile) / 25));
        grid-template-columns: repeat(auto-fill, calc(100vw / (var(--mobile) / 337)));
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        TABLET FIRST 
    */
    @media only screen and (min-width: 768px) {
        #merch-grid {
            display: grid;
            gap: calc(100vw / (var(--tablet) / 45));
            grid-template-columns: repeat(auto-fill, calc(100vw / (var(--tablet) / 300)));
        }
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST 
        1025px is used to allow for IPad Pro to use the Tabler Version
    */
    @media only screen and (min-width: 1025px) {
        #merch-grid {
            display: grid;
            gap: calc(100vw / (var(--desktop) / 55));
            grid-template-columns: repeat(auto-fill, calc(100vw / (var(--desktop) / 275)));
        }
    }
</style>

<!-- ===================
	SVELTE INJECTION TAGS 
=================== -->

<svelte:head>
	<!-- 
	Primary Meta Tags;
	https://metatags.io/ -->
	<title>ENUCS | Shop</title>
	<meta name="title" content="ENUCS | Shop">
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
	Open Graph / Facebook -->
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://www.enucs.org.uk/shop">
	<meta property="og:title" content="ENUCS | Shop">
	<meta property="og:description" content="Computing Society | ENUCS | Merchandise Shop">
	<meta property="og:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/shop">
	<meta property="twitter:title" content="ENUCS | Shop">
	<meta property="twitter:description" content="Computing Society | ENUCS | Merchandise Shop">
	<meta property="twitter:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if loading}
    <LoadingModel />
{/if}

<section>
    <h2 class='s-42 bold m-t-30' 
        in:fade>
        SHOP
    </h2>

    {#await promise}
        <!-- no need for awaiting promises,
            as the <MerchContainer />
            already has its own Promise -->
    {:then data}
        <button class='btn-primary m-b-40'
            disabled in:fade>
            <p class='s-16 bold'> 
                {data.result.length} ITEMS 
            </p>
        </button>
        <div id='merch-grid'>
            {#each data.result as item}
                <MerchContainer data={item} 
                    on:loading={() => initLoading()} />
            {/each}
        </div>

    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</section>