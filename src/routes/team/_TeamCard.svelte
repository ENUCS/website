<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import type { TeamMember } from '../../data/team-members'
    import TeamMemberLoader from './_TeamMemberLoader.svelte'
    import type { ContentLoaderProps } from '../../models/content-loader-interface'

    export let data: TeamMember

    /**
     * Decalring the ContentLoaderProps
     * values through the interface 
    */
    let contentLoaderProps: ContentLoaderProps = {
        width: `135`,
        height: `152`,
        primaryColor: '#f9f9f9'
    }

    // insiting on buffer for the component-page;
    let show: boolean = false;
    onMount(async() => {
        setTimeout(() => {
            show = true;
        }, 1250);
    });
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    .team-member-card {
        display: grid;
        justify-items: center;
    }
    img.team-member-img {
        box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
        width: 96px;
        height: 93px;
        background: #C4C4C4;
        border-radius: 20px;
        object-fit: cover;
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if !show}
    <div class='team-member-card'>
        <TeamMemberLoader {...contentLoaderProps} />
    </div>
{:else}
    <div class='team-member-card' 
        in:fade>
        <!-- team-member image -->
        <img 
            class='team-member-img'
            src={data.img}
            alt={data.name}
        />
        <!-- team member name -->
        <p class='s-18 bold color-secondary m-t-15'>
            {data.name}
        </p>
        <!-- team member position -->
        <p class='s-18 bold color-blue'>
            {data.position}
        </p>
    </div>
{/if}

