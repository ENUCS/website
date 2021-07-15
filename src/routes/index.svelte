<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->

<script lang="ts">
    import { onMount } from 'svelte';

    import DesktopVersion from '../components/view/desktop/DesktopHomeView.svelte'
    import MobileVersion from '../components/view/mobile/MobileHomeView.svelte'

    let viewportDesktop: boolean;

    onMount(async() => {
        var wInit = document.documentElement.clientWidth;
        if (wInit > 1024) {
            viewportDesktop = true;
        } else {
            viewportDesktop = false;
        }
        window.addEventListener("resize", function() {
            var w = document.documentElement.clientWidth;
            if (w > 1024) {
                viewportDesktop = true;
            } else {
                viewportDesktop = false;
            }
        });
    })

    // transition config, passed onto Nav & Footer also; (temporary)
    let transition_time: number = 1000;
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