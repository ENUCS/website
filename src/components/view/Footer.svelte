<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    // export let segment: string;

    // transition config, passed onto Nav & Footer also; (temporary)
    export let transition_time: number;

    let show: boolean = false;
    onMount(() => {
        setTimeout(() => {
            show = true;
        }, transition_time);
    });
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    footer {
        display: grid;
        grid-gap: 20px;
        justify-items: start;
        position: relative;
        padding: 20px;
        box-shadow: 0px -1px 2.5px rgb(0 0 0 / 25%);
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

<!-- ===================
	COMPONENT HTML
=================== -->

<!-- {#if show} -->
    <footer transition:fade>
        <img 
            src='./assets/img/enucs-brand/main-logo-512x512.png' 
            alt='enucs-brand-logo' 
            height='28px' width='87.11px' 
        />
        <a href="mailto:contact@enucs.org.uk">
            <p class='s-16 bold underline color-secondary'>
                info@enucs.org.uk
            </p>
        </a>
        <!-- 
        social media group -->
        <div class='row-space-out' style='width: 75%; '>
            <a href="https://www.napierstudents.com/organisation/societies/7541/">
                <button 
                    class='btn-primary'
                    disabled>
                    <p class='s-16'>
                        join us
                    </p>
                </button>
            </a>
            <a rel='external' href="https://twitter.com/enucs">
                <img 
                    class='social-img'
                    src='./assets/svg/icons/twitter-icon.svg' 
                    alt='' 
                />
            </a>
            <a rel='external' href='https://www.facebook.com/enucs/'>
                <img 
                    class='social-img'
                    src='./assets/svg/icons/facebook-icon.svg' 
                    alt='' 
                />
            </a>
            <a rel='external' href='https://discord.gg/hnh3fFq'>
                <img 
                    class='social-img'
                    src='./assets/svg/icons/discord-icon.svg' 
                    alt='' 
                />
            </a>
        </div>
        <img 
            src=".\assets\img\edinburgh-napier-brand-img.png" 
            alt="ednapier_logo"
            width="118.54px" height="35.41px"
        />
    </footer>
<!-- {/if} -->
