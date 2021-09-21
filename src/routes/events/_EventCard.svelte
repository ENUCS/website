<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { post } from '../../utils/init.js'
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { createEventDispatcher } from 'svelte'

    import ContentLoader from 'svelte-content-loader'

    import type { ContentLoaderProps } from '../../models/content-loader-interface'
    import type { Event } from '../../data/events'

	const dispatch = createEventDispatcher()

    export let data: Event
    // console.log('data', data)

    /**
     * Description
     * ~~~~~~~~~~~
     * Loads the data for the Event
     * and checks their availalitiy
     * dynamically for EACH EVENT CARD;
    */
    async function fetchEventJSONRegistrationData() {
        let response = await post(`events/fetchEventData`, data)
        return response
    }
    let promise = fetchEventJSONRegistrationData()

    /**
     * Declaring the ContentLoaderProps
     * values through the interface
     * [THE LOADING SVG];
    */
    let contentLoaderProps: ContentLoaderProps = {
        width: `100%`,
        height: `100%`,
        primaryColor: '#f9f9f9'
    }

    /**
     * Description
     * ~~~~~~~~~~~
     * Pass to the PARENT INFO on the SELECTED
     * EVENT;
    */
    function openEventForm(data: Event) {
		dispatch('select', {
			targetEvent: data
		});
	}
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    .card-event {
        background: #FFFFFF;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
        border-radius: 2.5px 2.5px 0px 0px;
    }
    .event-img {
        width: auto;
        height: 135.98px;
    }
    .event-desc {
        padding: 15px;
    }
    #registerBtn {
        width: 100%;
        border-radius: 0 0 2.5px 2.5px;
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

{#await promise}
    <!-- 
    promise is pending -->
    <div class='card-event' style="display: flex; height: 350px;"> 
        <ContentLoader {...contentLoaderProps} />
    </div>

{:then data_}
    <!-- 
    promise was fulfilled -->
    <div class='card-event column-space-center' in:fade>
        <!-- 
        ~~~~~~~~~
        EVENT IMAGE 
        -->
        <img
            class='event-img m-b-20'
            src={data_.img} 
            alt={data_.slug}
        />
        <!-- 
        ~~~~~~~~~
        EVENT INFO 
        -->
        <p class='s-16 color-secondary bold'> 
            {data_.date} 
        </p>
        <div class='event-desc'>
            <p class='s-14 color-secondary m-b-15'> 
                {data_.description} 
            </p>
            <p class='s-14 color-secondary m-b-5'> 
                <span class='bold color-blue'>
                    Location
                </span>  
                {data_.location} 
            </p>
            <p class='s-14 color-secondary m-b-15'> 
                <span class='bold color-blue'>
                    Time
                </span>  
                {data_.time} 
            </p>
            {#if data_.spaceAvailable}
                <p class='s-12'> spaces available </p>
            {/if}
        </div>
        <!--
        ~~~~~~~~~~~~
        buttton-for-confirm-event-registration
        -->
        {#if data_.spaceAvailable}
            <button id='registerBtn' class='btn-blue'
                on:click={() => openEventForm(data_)}>
                <p class='s-14'>
                    REGISTER
                </p>
            </button>

        {:else}
            <p class='s-12 bold color-error m-b-15'>
                Uh-oh! This event has been fully booked!
            </p>
        {/if}
    </div>

{:catch error}
    <!-- 
    promise was rejected -->
    {error}
{/await}