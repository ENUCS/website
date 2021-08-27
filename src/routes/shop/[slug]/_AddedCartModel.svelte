<!-- 
~~~~~~~~~~~~~~~~~~~
A simple website loading Model
That can be placed anywhere on the page
ti signal a loading state of an action.
~~~~~~~~~~~~~~~~~~~
-->

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { fade } from "svelte/transition";

    // maybe add a `kill-switch` for when the `loading is taking for`
    // too long...
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    #background-modal-blur {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 4;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }
    #modal-content-container {
        position: fixed;
        right: 0;
        left: 0;
        margin: auto;
        top: 0;
        bottom: 0;
        z-index: 5;
        display: flex;
        align-content: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: aliceblue;
        width: 172px;
        height: 123px;
        padding: 30px 37px 25px 37px;
        border-radius: 5px;
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

<div id='background-modal-blur' in:fade/>

<div id='modal-content-container' 
    in:fade>
    <img
        class='image-stripe-state'
        src="./assets/svg/navbar-shop-cart.svg" 
        alt="added-to-cart-item"
        width="33.07px"
    /> 
    <p class='s-16 bold color-dark m-t-10 no-wrap'>
        item(s) added to cart
    </p> 
</div>