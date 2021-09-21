<!-- 
~~~~~~~~~~~~~~~~~~~
Developed with the help and use of:
https://stackoverflow.com/questions/62723869/stripe-elements-card-mount-function-error-after-svelte-onmount-fires
~~~~~~~~~~~~~~~~~~~
-->

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { post } from '../../utils/init.js'
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { fade } from 'svelte/transition'

    import type { Event } from '../../data/events'

	const dispatch = createEventDispatcher()

    export let data: Event

    // processing states;
    let processing: boolean = false;
    let executing: boolean = false;
    let success: boolean = false;
    let error: boolean = false;
    let errorMsg: string;


    /**
     * Attendee Information
     * INTERFACE & DECLARATION
    */
    let attendeeData: {
        eventInfo: Event
        full_name: string
        email: string
        email_marketing: boolean
        tickets: number
    } = {
        eventInfo: data,
        full_name: undefined,
        email: undefined,
        email_marketing: false,
        tickets: 1
    }


    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Submit FORM for the attendee for target
     * event
    */
    async function submitForm() {
        executing = true;
        setTimeout(async() => {
            executing = false;
            processing = true;
            attendeeRegisterForEvent().then(() => {
                console.log('SENDING OUT EMAIL!')
                sendConfirmationEmail().then(() => {
                    success = true;
                    console.log('Successful Registration!')
                    setTimeout(async() => {
                        closeEventForm();
                        processing = false;
                        success = false;
                    }, 3500)
                }).catch((e) => {
                    error = true;
                    console.log(e)
                    errorMsg = e.message
                    setTimeout(async() => { 
                        error = false;
                        processing = false;
                    }, 3500);
                });
            }).catch((e) => {
                error = true;
                console.log(e)
                errorMsg = e.message
                setTimeout(async() => { 
                    error = false;
                    processing = false;
                }, 3500);
            });
        }, 1250)
    }


    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Submit FORM for the attendee for target
     * event on the JSON EVENT FILE;
    */
    async function attendeeRegisterForEvent() {
        let response = await post(`events/submitForm`, attendeeData)
        console.log('response', response)
        return response
    }


    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Sending out a Confiramtion EMAIL to the
     * ATENDEES CONFIRMING THEIR PRESNECE ON THE EVENT;
    */
    async function sendConfirmationEmail() {
        console.log('sending email to user!')
        let response = await post(`events/sendEmail`, attendeeData)
        return response
    }


    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * A component event trigger
     * that triggers in the PARENT
     * component an event; in this case
     * the event `on:close`.
    */
	function closeEventForm() {
		dispatch('close')
	}


    // negative ticketQuantity is NOT allowed;
    let minusBtnDisabled: boolean = true;
    $: if (attendeeData.tickets != undefined) {
        if (attendeeData.tickets == 1) {
            minusBtnDisabled = true
        } else {
            minusBtnDisabled = false
        }
    }


    // max-event-attendee PER person has been reached,
    // or NOT;
    let maxBtnDisabled: boolean = false;
    $: maxBtnDisabled = (attendeeData.tickets >= data.max_per_person)
    

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * Tracking the TICKETS QUANTITY VALUE
     * 
     * @param val
    */
    function changeQty(val: number) {
        if (attendeeData.tickets == undefined && val == 1) {
            attendeeData.tickets = 1
        } else if (attendeeData.tickets == undefined && val == -1) {
            attendeeData.tickets = undefined
        } else {
            attendeeData.tickets += val
        }
    }
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
    #form-modal {
        /* 
         */
        width: calc(100vw / (var(--mobile) / 328));
        height: 424px;
        /* 
         */
        position: fixed;
        right: 0;
        left: 0;
        margin: auto;
        top: 0;
        bottom: 0;
        z-index: 5;
        box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
            0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
        border-radius: 3.82px;
        padding: calc(100vw / (var(--mobile) / 80)) calc(100vw / (var(--mobile) / 15)) calc(100vw / (var(--mobile) / 35)) calc(100vw / (var(--mobile) / 15));
        background-color: #ffffff;
    }
    #close-stripe-modal {
        position: absolute;
        right: 15px;
        top: 15px;
        display: grid;
        justify-content: center;
        align-content: center;
        justify-items: center;
    }

    .image-stripe-state {
        width: calc(100vw / (var(--mobile) / 44));
        height: calc(100vw / (var(--mobile) / 44));
    }

    input[type='text'],
    input[type='email'] {
        width: 100%;
        height: 29px;
    }

    #form-title {
        position: absolute;
        left: 15px;
        top: 15px;
    }

    #execute-pay-btn {
        position: relative;
    }
    #executing-error-msg-box {
        position: absolute;
        top: 120%;
        right: 0;
        left: 0;
    }

    /* 
    buttons and links */
    button {
        margin-top: 22px;
        width: 100%;
    }
    button:hover {
        filter: contrast(115%);
    }
    button:disabled {
        opacity: 0.5;
        cursor: default;
    }

    .quantity-btn {
        width: 32px;
        height: 32px;
        /* const. */
        background: #37474F;
        border-radius: 2.5px;
        box-shadow: none;
        margin: 0;
    }
    /* quantity-item-select CSS */
    input[type='number']#quantity-input {
        width: 45px;
        height: 32px;
        margin: 0 5px;
        /* const. */
        background: #FFFFFF;
        border: 1.64px solid #E8E8E8;
        box-sizing: border-box;
        border-radius: 2.5px;
        -moz-appearance: textfield;
        text-align: center;
    }

    /* 
    ~~~~~~~~~~~~~~~~~~~~
        TABLET FIRST 
        767px is used to allow for 
        IPad to use the Tablet Version
    */
    @media only screen and (min-width: 767px) {

        #form-modal {
            width: calc(100vw / (var(--tablet) / 328));
            height: calc(100vw / (var(--tablet) / 424));
            padding: calc(100vw / (var(--tablet) / 80)) calc(100vw / (var(--tablet) / 15)) calc(100vw / (var(--tablet) / 35)) calc(100vw / (var(--tablet) / 15));
        }
        #close-stripe-modal {
            right: calc(100vw / (var(--tablet) / 15));
            top: calc(100vw / (var(--tablet) / 15));
        }
        .image-stripe-state {
            width: calc(100vw / (var(--tablet) / 44));
            height: calc(100vw / (var(--tablet) / 44));
            margin-bottom: calc(100vw / (var(--tablet) / 12));
        }

        /* 
        buttons and links */
        button {
            width: 100%;
            /* width: calc(100vw / (var(--tablet) / 273.03)); */
        }

        #redirect-hint {
            margin-top: calc(100vw / (var(--tablet) / 23));
        } #redirect-hint p {
            margin-left: calc(100vw / (var(--tablet) / 11));
        }
    }

    /* 
    ~~~~~~~~~~~~~~~~~~~~
        DESKTOP FIRST
        1025px is used to allow for IPad 
        Pro to use the Tablet Version
    */
    @media only screen and (min-width: 1025px) {
        
        #form-modal {
            width: calc(100vw / (var(--desktop) / 328));
            height: calc(100vw / (var(--desktop) / 424));
            padding: calc(100vw / (var(--desktop) / 80)) calc(100vw / (var(--desktop) / 15)) calc(100vw / (var(--desktop) / 35)) calc(100vw / (var(--desktop) / 15));
        }
        #close-stripe-modal {
            right: calc(100vw / (var(--desktop) / 15));
            top: calc(100vw / (var(--desktop) / 15));
        }
        .image-stripe-state {
            width: calc(100vw / (var(--desktop) / 44));
            height: calc(100vw / (var(--desktop) / 44));
            margin-bottom: calc(100vw / (var(--desktop) / 12));
        }

        /* 
        buttons and links */
        button {
            width: 100%;
            /* width: calc(100vw / (var(--desktop) / 273.03)); */
        }

        #redirect-hint {
            margin-top: calc(100vw / (var(--desktop) / 23));
        } #redirect-hint p {
            margin-left: calc(100vw / (var(--desktop) / 11));
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

<div id='background-modal-blur' transition:fade />

<div id='form-modal' class='column-space-stretch' transition:fade>
    <!-- 
    ~~~~~~~~~~~~~~~~~
    close-event-container -->
    <div 
        id='close-stripe-modal'
        on:click={closeEventForm}>
        <img 
            src="./assets/svg/icons/close-vector.svg" 
            alt="close-icon"
        />
        <p class='s-10 color-secondary bold'>close</p>
    </div>
    <!-- 
    ~~~~~~~~~~~~~~~
    DISPLAY FORM DATA FOR TARGET EVENT -->
    <p id='form-title' 
        class='s-22 bold color-secondary'
        style="font-style: normal;
        font-weight: bold;
        font-size: 22px;
        line-height: 26px;">
        REGISTER FOR
        <br />EVENT
    </p>
    <p class='s-14 bold color-secondary m-b-10'
        style='position: absolute;
            top: 65px;
            left: 15px;'>
        {data.title}
        <br />
        <span class='s-12'>
            {data.date}
        </span>
    </p>
    <!-- 
    ~~~~~~~~~~~~~~~
    DISPLAY FORM DATA FOR TARGET EVENT -->
    {#if processing && success}
        <div class="column-space-center">
            <img
                class='image-stripe-state m-b-10'
                src="./assets/svg/check-vector.svg" 
                alt="stripe-logo" in:fade
                style="margin-top: 50px;"
            />
            <p class="s-16 bold color-success" in:fade>
                Success!
            </p>
            <p class="s-14 cold color-secondary" in:fade>
                You have been registered!
            </p>

            <div id='redirect-hint' 
                class='row-space-center m-t-10'
                in:fade>
                <img
                    src="./assets/svg/email-dispatch-icon.svg" 
                    alt="back-arrow"
                    class="m-r-10"
                />
                <p class="s-12 color-secondary" style='text-align: right;'>
                    we have sent you
                    <br/>a confmration email
                </p>
            </div>
        </div>

    {:else if processing && error}
        <div class="column-space-center">
            <img
                class='image-stripe-state m-b-10'
                src="./assets/svg/error-vector.svg" 
                alt="error-icon"
                style="margin-top: 50px;"
                in:fade
            />
            <p class="s-16 bold color-error" in:fade>
                Uh-oh!
            </p>
            <p class="s-12" style='text-align: center;' in:fade>
                <!-- {errorMsg} -->
                You have either exceeded your ticket selection exceeded the event capacity 
                <br/>
                <b>OR</b> 
                <br/>you have exceeded your registration ticketing capacity
            </p>
        </div>

    {:else if processing}
        <div class="column-space-center">
            <img
                class='image-stripe-state m-b-10'
                src="./assets/svg/Group-animated.svg" 
                alt="processing-load"
                style="margin-top: 50px;"
                in:fade
            />
            <p class="s-16 bold color-blue-green-gradient" in:fade>
                Processing Event Registration
            </p>
            <p class="s-14" in:fade>
                hold on, we are registering you for the event
            </p>
        </div>
    {:else if !processing}
        <!-- 
        ~~~~~~~~~~~~~~~
        FORM EVENT START -->
        <form on:submit|preventDefault={submitForm} style="margin-top: 50px;">
            <!-- 
            ~~~~~~~~~~~~~~~
            NAME -->
            <fieldset class="form-group m-b-5">
                <label 
                    for="name"
                > 
                    <p class='s-14 bold'>
                        <span style="color: #C62828">*</span> 
                        Full Name 
                    </p> 
                </label>
                <input 
                    class="form-control s-16"
                    name="name" 
                    type="text" 
                    required 
                    bind:value={attendeeData.full_name}
                >
            </fieldset>
            
            <!-- 
            ~~~~~~~~~~~~~~~
            EMAIL -->
            <fieldset class="form-group m-b-5">
                <label 
                    for="email"
                > 
                    <p class='s-14 bold'>
                        <span style="color: #C62828">*</span> 
                        Email 
                    </p> 
                </label>
                <input 
                    class="form-control s-16"
                    name="email" 
                    type="email" 
                    required 
                    bind:value={attendeeData.email}
                >
            </fieldset>

            <p class='s-10 m-b-15'>
                Your email is used to send a one-off registration confirmation.
            </p>

            <!-- 
            ~~~~~~~~~~~~~~~
            MARKETING OPT OUT/IN -->
            <label 
                style="display: flex;"
                class='m-b-15'
                > 
                <input 
                    type='checkbox' 
                    name='market-opt'
                    bind:checked={attendeeData.email_marketing} 
                />
                <span class='s-10'>
                    Keep my email for future marketing and reach-out. <b>No spam.</b>
                </span>
            </label>

            <!-- 
            ~~~~~~~~~~~~~~~
            EVENT NUMBER TICKETS -->
            <div style='height: 32px;' 
                class='row-space-out'>
                <p class='color-secondary s-14'>
                    <span class='bold no-wrap'>
                        Number of Tickets
                    </span>
                    <br/>
                    <span class='s-10 no-wrap'>
                        2 tickets allowed per person
                    </span>
                </p>

                <!-- 
                ~~~~~~~~~~~~~~~
                SELECT TICKER QUANTITY -->
                <fieldset>
                    <div class='row-space-start'>
                        <button
                            class='quantity-btn'
                            type='button'
                            disabled={minusBtnDisabled}
                            on:click={() => changeQty(-1)}> 
                            <span class='s-22 bold color-primary'> - </span>
                        </button>
                        <input 
                            type="number" 
                            name="quantity"
                            placeholder="0"
                            bind:value={attendeeData.tickets}
                            id='quantity-input'
                            class='s-22'
                            required disabled />
                        <button 
                            class='quantity-btn'
                            type='button' 
                            disabled={maxBtnDisabled}
                            on:click={() => changeQty(+1)}> 
                            <span class='s-22 bold color-primary'> + </span>
                        </button>
                    </div>
                </fieldset>
            </div>

            <!-- 
            ~~~~~~~~~~~~~~~
            BUTTON -->
            <div id='execute-pay-btn'>
                <button class='btn-blue'
                    type='submit'>
                    <p class='s-14'>
                        CONFIRM REGISTRATION
                    </p>
                </button>
                <!-- 
                ~~~~~~~~~~~~~~~
                USER FEEDBACK
                UI/UX -->
                {#if executing}
                    <div id='executing-error-msg-box' 
                        class='row-space-center'
                        in:fade
                        >
                        <img 
                            class='m-r-10'
                            src='./assets/svg/stripe-loading-group-animated.svg'
                            alt=''
                            width="14px"
                        />
                        <p class='s-12 color-red bold'>
                            executing...
                        </p>
                    </div>
                {/if}
            </div>
        </form>
    {/if}
</div>