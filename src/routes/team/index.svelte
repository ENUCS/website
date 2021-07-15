<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->

<script lang="ts">
    import { onMount } from 'svelte';

    import DesktopTeamView from '../../components/view/desktop/DesktopTeamView.svelte'
    import MobileTeamView from '../../components/view/mobile/MobileTeamView.svelte'

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
    <title>ENUCS - Team</title>
</svelte:head>

<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
~~~~~~~~~~~~
-->

{#if !viewportDesktop}
    <div id='mobile-version'>
        <MobileTeamView />
    </div>
{:else}
    <div id='desktop-version'>
        <DesktopTeamView />
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