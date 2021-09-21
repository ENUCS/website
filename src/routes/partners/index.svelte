<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    import { enucs_partners_data } from '../../data/partners'
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
    #partners-grid {
        display: grid;
        gap: 65px;
        justify-items: center;
        align-items: center;
    }
    .partner-img {
        width: 144px;
        height: auto;
    }
    @media only screen and (min-width: 768px) {
        #partners-grid {
            display: grid;
            gap: 154px;
            grid-template-columns: repeat(auto-fill, 150px);
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
        PARTNERS
    </h2>
    
    <!-- 
    ~~~~~~~~~~~~~~~
    partners-page-load-section -->
    <div id='partners-grid' class='m-b-40'>
        {#each enucs_partners_data as item}
            <a rel=external 
                href={item.partner_CTA_link}>
                <div>
                    <img
                        class='partner-img'
                        src={item.img} 
                        alt={item.name}
                    />
                </div>
            </a>
        {/each}
    </div>

    <hr class='m-b-40' />

    <!-- 
    ~~~~~~~~~~~~~~~
    partners-page-info -->
    <p class='s-16 color-secondary'>
        We are always seeking new and exciting partnerships and/or sponsorships
        from various industires. 
        <br />
        <br />
        <span class='bold'>
            Get in touch - <span class='color-primary'>info@enucs.org.uk</span>
        </span>
    </p>
</section>