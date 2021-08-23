<!-- 
~~~~~~~~~~~~~~~~~~~
Loading SVG Injection Tag used
for the `loading` of the `Order Breakdown` Section in the 
`/basket` page
~~~~~~~~~~~~~~~~~~~
-->

<svelte:options namespace="svg" />
<ContentLoader {...$$props}>
    <rect width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect y="33" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect x="160" y="33" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect y="60" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect x="160" y="60" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect y="86" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect x="160" y="86" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect y="143" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect x="160" y="143" width="100%" height="17" rx="8.5" fill="#C4C4C4"/>
</ContentLoader>

<script>
    import ContentLoader from 'svelte-content-loader'
</script>