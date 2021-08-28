<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { onMount } from 'svelte';
</script>

<!-- ===================
	SVELTE INJECTION TAGS 
=================== -->

<svelte:head>
	<!-- 
	Primary Meta Tags;
	https://metatags.io/ -->
	<title>ENUCS | About</title>
	<meta name="title" content="ENUCS | About">
	<meta name="description" content="Computing Society | ENUCS | About">
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
	<meta property="og:url" content="https://www.enucs.org.uk/about">
	<meta property="og:title" content="ENUCS | About">
	<meta property="og:description" content="Computing Society | ENUCS | About">
	<meta property="og:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/about">
	<meta property="twitter:title" content="ENUCS | About">
	<meta property="twitter:description" content="Computing Society | ENUCS | About">
	<meta property="twitter:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<section>
    <!-- 
    ~~~~~~~~~~~~~~~
    page-title -->
    <h2 class='s-42 bold m-b-55'>
        ABOUT
    </h2>
    <div id='header-img-title' 
        class='m-b-35'>
        <p id='welcome-message-box' 
            class='s-18 m-b-35 color-white bold'>
            Welcome to the Computing Society 
            @Edinburgh Napier University! 😎🚀
        </p>
        <img 
            id='enucs-img'
            src="./assets/svg/design-img.svg" 
            alt="enucs-img"
        />
    </div>
    <p class='s-18 m-b-35 color-secondary'>
        We put on a magnitude of events throughout the academic year for our members.
        Giving students the opportunity to: meet new and like 
        minded students, collaborate on projects together, explore the industry with
        tour guides, go for social events, and simply give students an opportunity to 
        have more fun during their university experience.
        <br />
        <br />
        At <span class='bold'>ENU</span><span class='color-primary bold'>CS</span> we aim to be more than just a technology oriented society. 
        We always aim to expand our connections into other industry sectors
        that we see from within the committee that our members can ultimately benefit from.
        <br />
        <br />
        Throught-out the academic year our society explores technology in a magnitude of ways. 
        Whether it would be through organized workshops for our members during the academic year, 
        hackathons, prize-competitions, or guest-talks... we push for the knowledge of technology 
        by placing ourselves at the bleeding edge of the technological front.
        <br />
        <br />
        <span class='bold'>
            Looking to join us? 🥳
        </span>
    </p>
    <button class='btn-primary m-b-35'>
        <p class='s-16'> Join Us </p>
    </button>
    <p class='s-18'>
        <span class='bold'>
            Interested in learning more?
        </span>
        <br />
        <br />
        Feel free to reach out to us on social media or send us an email to 
        <span>
            <a href="mailto:contact@enucs.org.uk" 
                class='bold underline color-secondary'>
                info@enucs.org.uk
            </a>
        </span>
    </p>
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    h2 {
        text-align: start;
    }
    #enucs-img {
        width: 212.06px;
        height: 170px;
    }
    #header-img-title {
        display: grid;
        justify-items: center;
        align-items: center;
    }
    #welcome-message-box {
        background: var(--secondary);
        border-radius: 2.5px;
        padding: 12px;
        width: fit-content;
    }
    @media only screen and (min-width: 768px) {
        #header-img-title {
            display: grid;
            align-items: center;
            justify-content: start;
            justify-items: start;
        }
    }
</style>