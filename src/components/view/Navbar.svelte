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
    nav {
        /* dimensions */
        padding: calc(100vh / 29) calc(100vw / 20.833);
        /* inner-container-view */
        display: flex;
        justify-content: space-between;
        align-content: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
    } nav ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
    } nav ul li {
        display: inline;
        cursor: pointer;
        float: left;
    } nav ul li a {
        display: block;
        color: black;
        font-weight: bold;
        text-align: center;
        margin-left: 10px;
        text-decoration: none;
    } nav ul li a:hover, .active {
        color: rgb(255, 0, 0);
        text-decoration: underline;
    }
    /* 
    RESPONSIVE FOR TABLET (&+) [1024px] */
    @media screen and (min-width: 1024px) {
        nav {
            /* dimensions */
            padding: 0;
            margin: 0 calc(100vw / 7.741);
            /* position of container */
            position: absolute;
            top: 17px;
            right: 0;
            left: 0;
            z-index: 1000;
        }
    }
</style>

<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
    + this is the HTML for this PAGE '/team'
~~~~~~~~~~~~
-->
{#if show}
    <nav role="navigation" aria-label='Navigation Bar' transition:fade>
        <!-- 
        enucs-brand-logo -->
        <a rel='prefetch' href="/">
            <img 
                src='./assets/img/enucs_logo_brand_nav.png' 
                alt='enucs-brand-logo' 
                height='36px' width='112px' 
            />
        </a>
        <!-- 
        navbar menu -->
        <ul>
            <li>
                <a rel='prefetch' href="/" class:active={segment === undefined}>
                    HOME
                </a>
            </li>
            <li>
                <a rel='prefetch' href="/team" class:active={segment === 'team'}>
                    TEAM
                </a>
            </li>
        </ul>
    </nav>
{/if}
