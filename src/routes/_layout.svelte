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
    <title>Computing Society | ENUCS</title>
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<NavBar {segment} {transition_time} />
<main>
    {#if show}
        <div transition:fade>
            <slot />
        </div>
        <Footer {segment} {transition_time} />
    {/if}
</main>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    main {
        /* 
        so nothing exceeds the main-page-boundries */
        /* position: relative; */
        z-index: 0;
        margin: 0 auto;
        width: 100%;
        overflow: hidden;
        /* 
        make sure the initial page height is always full-device-height as a minumim */
        min-height: 100vh;
    }

    /* 
    RESPONSIVE FOR TABLET (&+) [1024px] */
    @media screen and (min-width: 1024px) {
        main {
            min-height: 100vh;
        }
    }
</style>