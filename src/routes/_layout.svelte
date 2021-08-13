<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->
<script lang="ts">
    import { onMount } from "svelte"
    import { fade } from "svelte/transition"

    import NavBar from '../components/view/Navbar.svelte'
    import Footer from '../components/view/Footer.svelte'

    export let segment: string
    // console.log('segment:', segment)

    // transition config, passed onto Nav & Footer also; (temporary)
    let transition_time: number = 1000

    /**
     * Function / METHOD;
     * ~~~~~~~~~~~~~~~~~~
     * Description:
     * Shows a target section after
     * X - (transition_time) passed
    */
    let show: boolean = false
    onMount(() => {
        setTimeout(() => {
            show = true
        }, transition_time)
    })
</script>
<!-- 
~~~~~~~~~~~~
	SVELTE INJECTION TAGS
~~~~~~~~~~~~
-->
<svelte:head>
    <title>Computing Society | ENUCS</title>
</svelte:head>
<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
~~~~~~~~~~~~
-->
<NavBar {segment} {transition_time} />
<main>
    {#if show}
        <div transition:fade>
            <slot />
        </div>
        <Footer {segment} {transition_time} />
    {/if}
</main>
<!-- 
~~~~~~~~~~~~
	COMPONENT STYLE
	mobile first,
~~~~~~~~~~~~
-->
<style>
    main {
        /* 
        so nothing exceeds the main-page-boundries */
        position: relative;
        z-index: 0;
        margin: 0 auto;
        width: 100%;
        overflow: hidden;
    }
</style>