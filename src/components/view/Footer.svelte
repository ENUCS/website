<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    // export let segment: string;
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    footer {
        grid-gap: 20px;
        padding: 20px;
        box-shadow: 0px -1px 2.5px rgb(0 0 0 / 5%);
        /* const. */
        display: grid;
        justify-items: start;
        position: relative;
    }
    #social-icons-container {
        width: 75%;
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        TABLET FIRST 
    */
    @media screen and (min-width: 767px) {
        footer {
            padding: calc(100vh / 29) calc(100vw / 20.833);
            /* const. */
            display: flex;
            justify-content: space-between;
            align-content: center;
            flex-wrap: nowrap;
            flex-direction: row;
            align-items: center;
        }
        footer #social-icons-container {
            width: auto;
        }
        footer #social-icons-container a {
            margin-right: 35px;
        }
    }
    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST 
        1025px is used to allow for IPad Pro to use the Tabler Version
    */
    @media only screen and (min-width: 1025px) {
        footer {
            padding: calc(100vh / 29) calc(100vw / (var(--desktop) / 240));
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

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
    <div id='social-icons-container' class='row-space-out'>
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
