<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->
<script lang='ts'>
    import { post } from '../../utils/init.js'

    import type { responseListItems } from '../../models/printful/proucts_printful'

    import MerchContainer from '../../components/_MerchCard.svelte'

    /**
     * Function / METHOD;
     * Description
     * Load the available products
     * from the Printful API using the
     * project PROXY on the backend
     * 
     * @return Promise<responseListItems>
    */
    async function getPrintfulShopItems(): Promise<responseListItems> {
        const data = {  // data to be passed to the PROXY
            method: 'GET',
            endpoint: `store/products`
        }
		const res = await post(`shop/printful`, data)
        // if (process.env.NODE_ENV != 'production') { console.info('shop-index.svelte', res) } // test-dev
        return res
	}
	let promise = getPrintfulShopItems();
</script>
<!-- 
~~~~~~~~~~~~
	COMPONENT STYLE
~~~~~~~~~~~~
-->
<style>
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        MOBILE FIRST 
    ~~~~~~~~~~~~~~~~~~~~
    */

    section {
        margin: calc(100vw / (var(--mobile) / 124)) calc(100vw / (var(--mobile) / 19));
    }

    #merch-grid {
        display: grid;
        gap: calc(100vw / (var(--mobile) / 61.58));
        grid-template-columns: repeat(auto-fill, calc(100vw / (var(--mobile) / 337)));
    }

    #shop-item-counter {
        margin-bottom: calc(100vw / (var(--mobile) / 43));
        padding: calc(100vw / (var(--mobile) / 5)) calc(100vw / (var(--mobile) / 12));
        /* 
        constant values */
        background: var(--white);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        width: fit-content;
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~
      RESPONSIVENESS:
    ~~~~~~~~~~~~~~~~~~~~
    */

    /* 
    ~~~~~~~~~~~~~~~~~~~~
        TABLET FIRST 
    ~~~~~~~~~~~~~~~~~~~~
    */

    @media only screen and (min-width: 768px) {
        section {
            margin: calc(100vw / (var(--tablet) / 210)) calc(100vw / (var(--tablet) / 54));;
        }
        #merch-grid {
            display: grid;
            gap: calc(100vw / (var(--tablet) / 49.9));
            grid-template-columns: repeat(auto-fill, calc(100vw / (var(--tablet) / 303.1)));
        }
        #shop-item-counter {
            margin-bottom: calc(100vw / (var(--tablet) / 60));
            padding: calc(100vw / (var(--tablet) / 5)) calc(100vw / (var(--tablet) / 12));
        }
    }

    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST 
    ~~~~~~~~~~~~~~~~~~~~
    */

    /* 1025px is used to allow for IPad Pro to use the Tabler Version */
    @media only screen and (min-width: 1025px) {
        section {
            margin: calc(100vw / (var(--desktop) / 210)) calc(100vw / (var(--desktop) / 240));
        }
        #merch-grid {
            display: grid;
            gap: calc(100vw / (var(--desktop) / 55));
            grid-template-columns: repeat(auto-fill, calc(100vw / (var(--desktop) / 275)));
        }
        #shop-item-counter {
            margin-bottom: calc(100vw / (var(--desktop) / 39));
            padding: calc(100vw / (var(--desktop) / 5)) calc(100vw / (var(--desktop) / 12));
        }
    }
</style>
<!-- 
~~~~~~~~~~~~
	SVELTE INJECTION TAGS
~~~~~~~~~~~~
-->
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
    
	<meta property="og:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/shop">
	<meta property="twitter:title" content="ENUCS | Shop">
	<meta property="twitter:description" content="Computing Society | ENUCS | Merchandise Shop">

	<meta property="twitter:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
</svelte:head>
<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
~~~~~~~~~~~~
-->
<section>
    <h2 class='s-42 bold'>SHOP</h2>

    {#await promise}
        <!-- no need for awaiting promises,
            as the <MerchContainer />
            already has its own Promise -->
    {:then data}
        <div id='shop-item-counter'>
            <p class='s-16 bold'> 
                {data.result.length} ITEMS 
            </p>
        </div>
        <div id='merch-grid'>
            {#each data.result as item}
                <MerchContainer data={item} />
            {/each}
        </div>

    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</section>