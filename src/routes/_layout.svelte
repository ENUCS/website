<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { onMount } from "svelte"
    import { fade } from "svelte/transition"

	import { cart } from '../stores/basket.js';

    import NavBar from '../components/view/Navbar.svelte'
    import Footer from '../components/view/Footer.svelte'

    export let segment: string // contains `THIS` page-name

    // transition config, passed onto Nav & Footer also; (temporary)
    let transition_time: number = 1000

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~~
     * Shows a target section after
     * X - (transition_time) passed
    */
    let show: boolean = false
    onMount(() => {
        setTimeout(() => {
            show = true
        }, transition_time)
    })

    // exposing the stores to the whole app through our layout file,
    
	// Make sure we're running on the client
	if (process.browser) {
		// Before we can use set on country we need to call the
		// useLocalStorage doing this at the _layout file makes
		// all routes and components exposed to this so we can
		// import the state and call set anywhere like Btn.svelte
		cart.useLocalStorage();
		// Log it to make sure it works client side
		// console.log(localStorage.getItem('cart'));
		// solution to JSON Err,
		// localStorage.clear();
	}
</script>

<!-- ===================
	SVELTE INJECTION TAGS 
=================== -->

<svelte:head>
	<!-- 
	Primary Meta Tags;
	https://metatags.io/ -->
	<title>Computing Society | ENUCS</title>
	<meta name="title" content="Computing Society | ENUCS">
	<meta name="description" content="Computing Society | Edinburgh Napier University | ENUCS">
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
	<meta property="og:url" content="https://www.enucs.org.uk/">
	<meta property="og:title" content="Computing Society | ENUCS">
	<meta property="og:description" content="Computing Society | Edinburgh Napier University | ENUCS">
	<meta property="og:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/">
	<meta property="twitter:title" content="Computing Society | ENUCS">
	<meta property="twitter:description" content="Computing Society | Edinburgh Napier University | ENUCS">
	<meta property="twitter:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<main>
    {#if show}
        <NavBar {segment} />
        <div transition:fade>
            <slot />
        </div>
        <Footer />
    {/if}
</main>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    main {
        /* 
        so nothing exceeds the main-page-boundries */
        position: relative;
        z-index: 0;
        margin: 0 auto;
        width: 100%;
        overflow: hidden;
        /* 
        make sure the initial page height is always full-device-height as a minumim */
        /* min-height: 100vh; */
    }

    /* 
    RESPONSIVE FOR TABLET (&+) [1024px] */
    @media screen and (min-width: 1024px) {
        main {
            /* min-height: 100vh; */
        }
    }
</style>