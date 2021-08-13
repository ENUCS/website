<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->

<script lang="ts">
    import { onMount } from 'svelte'

    import DesktopVersion from '../components/view/desktop/DesktopHomeView.svelte'
    import MobileVersion from '../components/view/mobile/MobileHomeView.svelte'

    let viewportDesktop: boolean

    /**
     * Function / METHOD;
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * This function loads when all of the
     * rest of the components have loaded
     * and rendered, checking via JS the viewport
     * of the client device and changing between
     * appropiate components to display the correct
     * component, tailored to a specifc device.
    */
    onMount(async() => {
        var wInit = document.documentElement.clientWidth
        if (wInit > 1024) {
            viewportDesktop = true
        } else {
            viewportDesktop = false
        }
        window.addEventListener("resize", function() {
            var w = document.documentElement.clientWidth
            if (w > 1024) {
                viewportDesktop = true
            } else {
                viewportDesktop = false
            }
        })
    })

    // transition config, passed onto Nav & Footer also; (temporary)
    let transition_time: number = 1000
</script>

<!-- 
~~~~~~~~~~~~
	SVELTE INJECTION TAGS
    SEO Stuff
~~~~~~~~~~~~
-->

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

	<!-- <meta property="og:image" content="https://www.spacerealm.live/assets/img/logo-main.png"> -->
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/">
	<meta property="twitter:title" content="Computing Society | ENUCS">
	<meta property="twitter:description" content="Computing Society | Edinburgh Napier University | ENUCS">

	<!-- <meta property="twitter:image" content="https://www.spacerealm.live/assets/img/logo-main.png"> -->
</svelte:head>

<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
~~~~~~~~~~~~
-->

{#if !viewportDesktop}
    <div id='mobile-version'>
        <MobileVersion />
    </div>
{:else}
    <div id='desktop-version'>
        <DesktopVersion />
    </div>
{/if}

<!-- 
~~~~~~~~~~~~
	COMPONENT STYLE
~~~~~~~~~~~~
-->

<style>
    #desktop-version {
        min-height: 100vh;
    }
</style>