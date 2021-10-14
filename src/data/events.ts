/**
 * INTERFACE for the
 * Indiviual Partner
*/
export interface Event {
    img: string                 // event-cover-image in `static/img/event` location
    slug: string                // event slug
    title: string               // event title
    description: string         // event description
    location: string            // event location
    time: string                // event time
    max_capacity: number        // event max-people turnup
    max_per_person: number      // event max-per-person number of tickets
    date: string                // event date
    plannedAttendees?: number   // event planned (those coming to the event) attendees (added on loading the page)
    spaceAvailable?: boolean    // event still open for new registrations
}

/**
 * Contains the data for the ENUCS
 * Partners Objects;
 * [UPDATABLE]
*/
export const enucs_events: Array<Event> = [
    // REVOLUTION BAR SOCIAL EVENT;
    {
        img: './assets/img/events/revolution_bar.png',
        slug: 'revolution-bar-social',
        title: 'Revolution Bar Social',
        description: `We welcome everyone to come to the event 
            for the first official freshers Computing Society Freshers Event 🚀😎`,
        date: '24th September 2021',
        location: 'Edinburgh, Revolution Bar',
        time: '20:00 - 22:00',
        // tracking capacity;
        max_capacity: 20,
        max_per_person: 2
    },
    // SVELTEJS - SAPPER EVENT;
    {
        img: './assets/img/events/MIGUEL-EVENT-SVELTE.png',
        slug: 'svelte-sapper-event',
        title: 'SvelteJs - Blazing Fast Website Framework',
        description: `We welcome everyone to our first on campus event
            to talk about SvelteJs - SapperJs, the most loved way to develop websites & webapps
            and blazingly fast 🚀😎 Come for some Free Pizza & Drinks as we talk about technology and introduce to the society`,
        date: '14th October 2021',
        location: 'Edinburgh, Merchiston Campus, Room E13',
        time: '18:00 - 20:00',
        // tracking capacity;
        max_capacity: 20,
        max_per_person: 2
    },
]