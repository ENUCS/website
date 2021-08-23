<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
    import { cart } from "../../stores/basket";

    import type { SyncVariant } from '../../models/printful/proucts_printful'

    export let data: SyncVariant

    /**
     * Function / Method
     * ~~~~~~~~~~~~~~~~~
     * Description:
     * 
    */
   function removeItem(itemSKUVal: string) {
       cart.removeItem(itemSKUVal)
   }
</script>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
    /*
    ~~~~~~~~~~~~~~~~~~~~
    basket-item-card-CSS-style
    */
    .cart-card {
        width: 100%;
        max-width: 445px;
        height: 121px;
        position: relative;
        background: var(--white);
        box-shadow: 0px 0px 2.5px rgb(0 0 0 / 25%);
        border-radius: 2.5px;
        display: flex;
        overflow: hidden;
        justify-content: space-between;
    }
    .cart-card img.img-item-preview {
        width: 123px;
        height: inherit;
        background: var(--white);
    }
    .cart-card .info-container {
        padding: 10px 5px;
    }
    .cart-card .delete-item-box {
        background: var(--black);
        height: 100%;
        width: 28px;
        object-fit: scale-down;
        cursor: pointer;
    }

    .price-item-box {
        position: absolute;
        bottom: 0;
        background: #FF5555;
        border-radius: 0px 2.5px 0px 0px;
        padding: 4px 6px;
        color: white;
    }

     /* ===================
        DESKTOP FIRST 
        1025px is used to allow for IPad Pro to use the Tablet Version
    =================== */

    @media only screen and (min-width: 1025px) {
        .cart-card:hover {
            box-shadow: 0px 0px 4px rgb(0 0 0 / 30%);
        }
    }
</style>

<!-- ===================
	COMPONENT HTML
=================== -->

<div class='cart-card'>
    <div class="price-item-box">
        <p class='s-12 bold color-white'>(x{data.quantity}) {data.retail_price} {data.currency}</p>
    </div>
    {#each data.files as file}
        {#if file.type == 'preview'}
            <img 
                class='img-item-preview'
                src={file.preview_url}
                alt="prview-img"
                title="remove-image-from-basket"
            />
        {/if}
    {/each}
    <div class="info-container">
        <p class='s-12 bold'>{data.name}</p>
        <table>
            <tr>
                <td>
                    <p class='s-12'>Qty.</p>
                </td>
                <td>
                    <span class='s-12 bold'>{data.quantity}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <p class='s-12'>Color</p>
                </td>
                <td>
                    <span class='s-12 bold'>{data.further_variant_info.color}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <p class='s-12'>Size</p>
                </td>
                <td>
                    <span class='s-12 bold'>{data.further_variant_info.size}</span>
                </td>
            </tr>
        </table>
    </div>
    <img 
        class='delete-item-box'
        src='./assets/svg/delete-item-cross-white-vector.svg' 
        alt="X"
        on:click={() => removeItem(data.sku)}
    />
</div>