<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { onMount } from 'svelte';
    import TeamCard from './_TeamCard.svelte'
    import { team_members_data } from '../../data/team-members'
</script>

<!-- ===================
	SVELTE INJECTION TAGS 
=================== -->

<svelte:head>
	<!-- 
	Primary Meta Tags;
	https://metatags.io/ -->
	<title>ENUCS | Team</title>
	<meta name="title" content="ENUCS | Team">
	<meta name="description" content="Computing Society | ENUCS | Team">
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
	<meta property="og:url" content="https://www.enucs.org.uk/shop">
	<meta property="og:title" content="ENUCS | Team">
	<meta property="og:description" content="Computing Society | ENUCS | Team">
    
	<meta property="og:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/shop">
	<meta property="twitter:title" content="ENUCS | Team">
	<meta property="twitter:description" content="Computing Society | ENUCS | Team">

	<meta property="twitter:image" content="https://www.spacerealm.live/assets/img/logo-main.png">
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<section>
    <!-- 
    ~~~~~~~~~~~~~~~
    page-title -->
    <h2 class='s-42 bold m-b-55'>
        TEAM
    </h2>
    <!-- 
    ~~~~~~~~~~~~~~~
    team-members-card -->
    <div id='team-member-grid'>
        {#each team_members_data as item}
            <TeamCard data={item} />
        {/each}
    </div>
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    section {
        display: grid;
        justify-items: center;
    }
    #team-member-grid {
        display: grid;
        gap: 55px
    }
</style>