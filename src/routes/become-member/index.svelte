<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { enucs_member_perks } from '../../data/become-member'
</script>

<!-- ===================
	SVELTE INJECTION TAGS 
=================== -->

<svelte:head>
	<!-- 
	Primary Meta Tags;
	https://metatags.io/ -->
	<title>ENUCS | Partners</title>
	<meta name="title" content="ENUCS | Partners">
	<meta name="description" content="Computing Society | ENUCS | Partners">
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
	<meta property="og:url" content="https://www.enucs.org.uk/partners">
	<meta property="og:title" content="ENUCS | Partners">
	<meta property="og:description" content="Computing Society | ENUCS | Partners">
	<meta property="og:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
	<!-- 
	Twitter -->
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content="https://www.enucs.org.uk/partners">
	<meta property="twitter:title" content="ENUCS | Partners">
	<meta property="twitter:description" content="Computing Society | ENUCS | Partners">
	<meta property="twitter:image" content="https://www.enucs.org.uk/assets/img/enucs-brand/main-logo-512x512.png">
</svelte:head>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    h2 {
        text-align: start;
    }
    #become-members-grid {
        display: grid;
        gap: 55px;
        justify-items: center;
        align-items: center;
    }
    .perk-image-cover {
        max-width: 339px;
        width: 100%;
        height: auto;
    }
    @media only screen and (min-width: 768px) {
        #become-members-grid {
            display: grid;
            gap: 65px;
            grid-template-columns: repeat(auto-fill, 292px);
            align-items: start;
            justify-items: start;
            justify-content: space-between;
            align-content: center;
        }
        .perk-image-cover {
            width: inherit;
            height: auto;
        }
    }
    @media only screen and (min-width: 1025px) {
        #become-members-grid {
            display: grid;
            gap: 35px;
            grid-template-columns: repeat(auto-fill, 292px);
        }
        .perk-image-cover {
            width: inherit;
            height: auto;
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

<section>
    <!-- 
    ~~~~~~~~~~~~~~~
    page-title -->
    <h2 class='s-42 bold m-b-55'>
        BECOME A MEMBER
    </h2>

    <p class='s-14 color-secondary m-b-30'>
        Support us by becoming a member of our society! And gain <b>MEMBER PERKS!</b>
    </p>
    
    <!-- 
    ~~~~~~~~~~~~~~~
    partners-page-load-section -->
    <div id='become-members-grid' class='m-b-40'>
        {#each enucs_member_perks as item}
            <div class='column-space-center'>
                <img
                    class="perk-image-cover m-b-15"
                    src={item.coverImg} 
                    alt={item.title}
                />
                <div style="text-align: center;">
                    {@html item.description}
                </div>
            </div>
        {/each}
    </div>

    <!-- 
    ~~~~~~~~~~~~~~~
    enucs-become-member ENSA link -->
    <a href="https://www.napierstudents.com/organisation/societies/7541/">
        <button 
            class='btn-blue' style="place-content: center;">
            <p class='s-16 bold'>
                BECOME MEMBER
            </p>
        </button>
    </a>
</section>