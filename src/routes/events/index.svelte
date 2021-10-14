<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { post } from '../../utils/init.js'
    import { enucs_events } from '../../data/events'
    import EventRegisterModal from './_EventRegisterModal.svelte'
    import EventCard from './_EventCard.svelte'

    import type { Event } from '../../data/events'

    let showRegisterForm: boolean = false
    let data: Event

    /**
     * Description
     * ~~~~~~~~~~~
     * Opens the Event Registration Form
    */
    function openEventForm(event) {
        data = event.detail.targetEvent
        showRegisterForm = true
    }

    /**
     * Description
     * ~~~~~~~~~~~
     * Closes the Event Registration Form
     * And Resets the target_event data for EVENT SELECTED;
    */
    function closeEventForm() {
        data = undefined
        showRegisterForm = false
    }
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- svelte method, prevents user from clicking 
    `enter` and by-passing form validation checks,
    accessing Stripe right away. -->
    <svelte:window on:keydown={e => { if (e.key === 'Enter') { e.preventDefault() }}} />

<!-- ===================
	SVELTE INJECTION TAGS 
=================== -->

<svelte:head>
	<!-- 
	Primary Meta Tags;
	https://metatags.io/ -->
	<title>ENUCS | Events</title>
	<meta name="title" content="ENUCS | Events">
	<meta name="description" content="Computing Society | ENUCS | Events">
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
	<meta property="og:url" content="https://www.enucs.org.uk/events">
	<meta property="og:title" content="ENUCS | Events">
	<meta property="og:description" content="Computing Society | ENUCS | Events">
	<meta property="og:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/events">
	<meta property="twitter:title" content="ENUCS | Events">
	<meta property="twitter:description" content="Computing Society | ENUCS | Events">
	<meta property="twitter:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
</svelte:head>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    h2 {
        text-align: start;
    }
    #events-grid {
        display: grid;
        gap: 65px;
        justify-items: center;
        align-items: center;
    }
    @media only screen and (min-width: 768px) {
        #events-grid {
            display: grid;
            gap: 80px;
            grid-template-columns: repeat(auto-fill, 275px);
            align-items: start;
        }
    }
    @media only screen and (min-width: 1025px) {
        #events-grid {
            display: grid;
            gap: 154px;
            grid-template-columns: repeat(auto-fill, 350px);
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if showRegisterForm}
    <EventRegisterModal 
        data={data}
        on:close={closeEventForm}
    />
{/if}

<section>
    <!-- 
    ~~~~~~~~~~~~~~~
    page-title -->
    <h2 class='s-42 bold m-b-55'>
        EVENTS
    </h2>
    <!-- 
    ~~~~~~~~~~~~~~~
    events-page-load-section -->
    <div id='events-grid' class='m-b-40'>
        {#each enucs_events as item}
            <EventCard 
                data={item}
                on:select={openEventForm}
             />
        {:else}
            <p class='s-12 color-secondary'>
                <span class='bold'>
                    Uh-oh!
                    We do not have any upcoming events planned yet 😔
                </span>
                <br />
                <br />
                Please check back later, or get in touch with us on our Discord on our next event!
            </p>
        {/each}
    </div>
</section>