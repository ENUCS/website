<!-- 
~~~~~~~~~~~~~~~~~~~
Loading SVG Injection Tag used
for the `loading` of the `Shipping Type` Section in the 
`/basket` page
~~~~~~~~~~~~~~~~~~~
-->

<svelte:options namespace="svg" />
<ContentLoader {...$$props}>
    <rect width="268" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect y="29" width="268" height="17" rx="8.5" fill="#C4C4C4"/>
    <rect y="58" width="268" height="17" rx="8.5" fill="#C4C4C4"/>
</ContentLoader>

<script>
    import ContentLoader from 'svelte-content-loader'
</script>