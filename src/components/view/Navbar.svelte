<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { onMount } from "svelte";
    import { fade, fly, slide } from "svelte/transition";

    import { cart } from "../../stores/basket.js";

    let cartQuantity: number
    $: cartQuantity = $cart.cartItemsQty

    export let segment: string;

    // transition config, passed onto Nav & Footer also; (temporary)
    export let transition_time: number;

    let show: boolean = false;
    onMount(() => {
        setTimeout(() => {
            show = true;
        }, transition_time);
    });

    let mobileNavShow: boolean = true;
    let mobileNavToggleMenu: boolean = false

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * This function loads when all of the
     * rest of the components have loaded
     * and rendered, checking via JS the viewport
     * of the client device and changing between
     * appropiate components to display the correct
     * component, tailored to a specifc device.
    */
    onMount(async() => {
        var wInit = document.documentElement.clientWidth
        if (wInit > 425) {
            mobileNavShow = false
        } else {
            mobileNavShow = true
        }
        window.addEventListener("resize", function() {
            var w = document.documentElement.clientWidth
            if (w > 425) {
                mobileNavShow = false
            } else {
                mobileNavShow = true
            }
        })
    })
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    nav {
        /* position: relative; */
        /* dimensions */
        position: sticky;
        top: 0;
        padding: calc(100vh / 29) calc(100vw / 20.833);
        z-index: 2;
        background: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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

    nav #mobile-nav {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 100;
        background-color: #FFFFFF;
        box-shadow: 0px 4px 4px rgb(0 0 0 / 25%), inset 0px 4px 4px rgb(0 0 0 / 25%);
	} 
    nav #mobile-nav ul {
        display: grid;
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        justify-content: space-evenly;
        height: inherit;
        justify-items: center;
        align-items: baseline;
        align-content: space-evenly;
    } 
    nav #mobile-nav ul li {

        width: 100vw;
        height: 43px;
    }
    nav #mobile-nav ul li a {
        margin-left: 0;
        height: inherit;

        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
        flex-direction: row;
        flex-wrap: nowrap;

    } nav #mobile-nav ul li a.active {
        color: white;
        text-decoration: underline;
        background: #FF5555;
        
    } nav #mobile-nav ul li a.active p {
        color: white;

    }

    /* Shopping Cart - STYLE */
	#basket-icon {
		/* dimensions */
        height: 20px;
        width: 17.5px;
		/* organize display, */
		position: relative;
		/* color & design, */
		background-image: url('/assets/svg/navbar-shop-cart.svg');
		background-repeat: no-repeat;
		background-position: center;
	}
    #basket-icon.switchBasket {
		background-image: url('/assets/svg/navbar-shop-cart-selected.svg') !important;
    }

	#basket-container {
		/* organize display, */
		display: grid;
		grid-auto-flow: column;
		grid-gap: 5.5px;
		align-items: center;
		cursor: pointer;
	} 

	#basket-num {
		text-align: center;
		position: absolute;
		top: -5px;
		left: 20px;
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

        #basket-container:hover {
		    /* color & design, */
            color: #60CF70;
        } #basket-container:hover #basket-icon {
            /* color & design, */
            background-image: url('/assets/svg/navbar-shop-cart.svg');
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

<!-- {#if show} -->
<nav 
    role="navigation" 
    aria-label='Navigation Bar'
    class='row-space-out'
    transition:fade >
    <!-- 
    ~~~~~~~~~~~
    enucs-brand-logo -->
    <a rel='prefetch' href="/" on:click={() => mobileNavToggleMenu = false}>
        <img 
            src='./assets/img/enucs-brand/main-logo-512x512.png' 
            alt='enucs-brand-logo' 
            height='36px' width='112px' 
        />
    </a>
    <!-- 
    ~~~~~~~~~~~
    navbar menu DESKTOP VIEW -->
    {#if !mobileNavShow}
        <div class='nav-menu'>
            <ul>
                <li>
                    <a rel='prefetch' 
                        href="/" 
                        class:active={segment === undefined}
                        >
                        HOME
                    </a>
                </li>
                <li>
                    <a rel='prefetch' 
                        href="/team" 
                        class:active={segment === 'team'}
                        >
                        TEAM
                    </a>
                </li>
                <li>
                    <a rel='prefetch' 
                        href="/shop" 
                        class:active={segment === 'shop'}
                        >
                        SHOP
                    </a>
                </li>
                <li>
                    <a rel='prefetch' 
                        on:click={() => mobileNavToggleMenu = false} 
                        href="/basket" 
                        class:active={segment === 'basket'}
                        >
                        <div id='basket-container'>
                            <span class='s-16 bold'> BASKET </span>
                            <div id='basket-icon'>
                                <div id='basket-num'> <p> {cartQuantity} </p> </div>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    <!-- 
    ~~~~~~~~~~~
    navbar menu MOBILE VIEW -->
    {:else}
        {#if !mobileNavToggleMenu}
            <img id='mobileMenu' 
                on:click={() => mobileNavToggleMenu = true} 
                src="./assets/svg/navbar-menu-vector.svg" 
                alt="menu-nav"
                in:fade
            />
        {:else}
            <img id='mobileMenu' 
                on:click={() => mobileNavToggleMenu = false} 
                src="./assets/svg/navbar-menu-selected-vector.svg" 
                alt="menu-nav"
                in:fade
            />
        {/if}
        {#if mobileNavToggleMenu}
            <div in:slide 
                out:slide 
                id='mobile-nav'
                >
                <ul>
                    <li>
                        <a rel='prefetch' 
                            on:click={() => mobileNavToggleMenu = false} 
                            href="/" 
                            class:active={segment === undefined}
                            >
                            <p class='s-16 bold'>
                                HOME
                            </p>
                        </a>
                    </li>
                    <li>
                        <a rel='prefetch' 
                            on:click={() => mobileNavToggleMenu = false} 
                            href="/team" 
                            class:active={segment === 'team'}
                            >
                            <p class='s-16 bold'>
                                TEAM
                            </p>
                        </a>
                    </li>
                    <li>
                        <a rel='prefetch' 
                            on:click={() => mobileNavToggleMenu = false} 
                            href="/shop" 
                            class:active={segment === 'shop'}
                            >
                            <p class='s-16 bold'>
                                SHOP
                            </p>
                        </a>
                    </li>
                    <li>
                        <a rel='prefetch'
                            on:click={() => mobileNavToggleMenu = false} 
                            href="/basket" 
                            class:active={segment === 'basket'}
                            >
                            <div id='basket-container'>
                                <span class='s-16 bold'> BASKET </span>
                                <div id='basket-icon' class:switchBasket={segment === 'basket'}>
                                    <div id='basket-num'> <p class='color-secondary s-10 bold'> {cartQuantity} </p> </div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        {/if}
    {/if}
</nav>
<!-- {/if} -->
