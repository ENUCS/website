<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->

<script lang='ts'>
    import { 
        post 
    } from '../../utils/init.js'

    import type { 
        responseListItems 
    } from '../../api/modals/proucts_printful'

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
    MOBILE FIRST
~~~~~~~~~~~~
-->


<style>
    section {
        margin: calc(100vw / 3.02419354839) calc(100vw / 19.7368421053);
    }

    #merch-grid {
        display: grid;
        gap: calc(100vw / 6.08963949334);
        grid-template-columns: repeat(auto-fill, calc(100vw / 1.11275964392));
    }

    #shop-item-counter {
        margin-bottom: calc(100vw / (var(--mobile) / 43));
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

        section {
            margin: 210px calc(100vw / 7.741);
        }

        #merch-grid {
            display: grid;
            gap: calc(100vw / 24.2669362993);
            grid-template-columns: repeat(auto-fill, calc(100vw / 4.75090729132));
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
        <p>...Loading Shop Items...</p>
    {:then data}
        <p 
            id='shop-item-counter' 
            class='s-14 bold'> 
            {data.result.length} ITEMS 
        </p>
        <div id='merch-grid'>
            {#each data.result as item}
                <MerchContainer data={item} />
            {/each}
        </div>

    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</section>