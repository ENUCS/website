<script lang='ts'>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let segment: string;

    // transition config, passed onto Nav & Footer also; (temporary)
    export let transition_time: number;

    let show: boolean = false;
    onMount(() => {
        setTimeout(() => {
            show = true;
        }, transition_time);
    });
</script>

<!-- 
~~~~~~~~~~~~
	COMPONENT STYLE
    + this is the CSS for this PAGE '/team'
~~~~~~~~~~~~
-->

<style>
    footer {
        /* dimensions */
        margin: 0 calc(100vw / 7.741);
        /* inner-container-view */
        display: grid;
        text-align: -webkit-center;
        text-align: -moz-center;
        grid-gap: 20px;
        justify-content: center;
        justify-items: center;
        position: relative;
    } footer #social-group {
        /* inner-container-view */
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        justify-items: center;
    } footer #social-group a {
        margin-left: 25px;
    }
    /* 
    RESPONSIVE FOR TABLET (&+) [1024px] */
    @media screen and (min-width: 1024px) {
        footer {
            /* position of container */
            position: absolute;
            bottom: 17px;
            right: 0;
            left: 0;
            /* inner-container-view */
            display: flex;
            justify-content: space-between;
            align-content: center;
            flex-wrap: nowrap;
            flex-direction: row;
            align-items: center;
        }
    }
</style>

<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
    + this is the HTML for this PAGE '/team'
~~~~~~~~~~~~
-->

<!-- {#if show} -->
    <footer transition:fade>
        <img 
            src=".\assets\img\edinburgh-napier-brand-img.png" 
            alt="ednapier_logo"
            width="118.54px" height="35.41px"
        />
        <a href="mailto:info@enuets.com">
            info@enucs.org.uk
        </a>
        <img 
            src='./assets/img/enucs_logo_brand_nav.png' 
            alt='enucs-brand-logo' 
            height='28px' width='87.11px' 
        />
        <a href="https://www.napierstudents.com/organisation/societies/7541/">
            join us
        </a>
        <!-- 
        social media group -->
        <div id='social-group'>
            <a rel='external' href="https://twitter.com/enucs">
                <img 
                    src='./assets/svg/icons/twitter-icon.svg' 
                    alt='' 
                />
            </a>
            <a rel='external' href="https://www.facebook.com/enucs/">
                <img 
                    src='./assets/svg/icons/facebook-icon.svg' 
                    alt='' 
                />
            </a>
            <a rel='external' href="https://discord.gg/hnh3fFq">
                <img 
                    src='./assets/svg/icons/discord-icon.svg' 
                    alt='' 
                />
            </a>
        </div>
    </footer>
<!-- {/if} -->
