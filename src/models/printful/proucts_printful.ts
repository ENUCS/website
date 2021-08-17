/**
 * Data Interface for the API
 * in the Products API for Printful
 * ------
 * https://www.printful.com/es/docs/products
*/

import type { Variant } from './printful-catalog-api'

interface Page {
    total: number	            // Total number of items available
    offset: number	            // Current result set page offset
    limit: number	            // Max number of items per page
}

export interface SyncProduct {
    id: number	            // Sync Product ID
    external_id: string 	// Product ID from the Ecommerce platform
    name: string	        // Product name
    variants: number	    // Total number of Sync Variants belonging to this product
    synced: number	        // Number of synced Sync Variants belonging to this product
    thumbnail_url?: string	// Thumbnail image for the product
    is_ignored?: boolean 	// Indicates if this Sync Product is ignored
}

export interface File {
    type: string 
    url: string
    preview_url: string // Source URL where the file is downloaded from
}

export interface SyncVariant {
    id: number                  // Sync Variant ID
    external_id: string         // Variant ID from the Ecommerce platform
    sync_product_id: number     // Sync Product ID that this variant belongs to
    name: string                // Sync Variant name
    synced: boolean             // Indicates if this Sync Variant is properly linked with Printful product
    variant_id: number          // Printful Variant ID that this Sync Variant is synced to
    warehouse_product_variant_id: number // Warehousing variant id. If sync variant is connected with a warehousing item, this is its id
    retail_price: string        // Retail price that this item is sold for
    sku: string                 // SKU of this Sync Variant
    currency: string            // Currency in which prices are returned
    product: {
        variant_id: number      // Variant ID
        product_id: number      // Product ID of this variant
        image: string           // URL of a sample image for this variant
        name: string            // Display name of this variant
    }
    files: Array<File>          // Array of attached printfiles / preview images
    is_ignored: boolean	        // Indicates if this Sync Variant is ignored
    // options: ItemOption [ ]	    // Array of additional options for the configured product/variant

    // not official pritful param.
    further_variant_info?: Variant  // A Further Info Variant Interface
    quantity: number    // necessary to MAP `this` to the Order <Item>
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
 * FINAL RESPONSES /  REQUESTS ORDER COSTS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export interface responseListItems {
    code: number
    result: Array<SyncProduct>
    paging: Page                    // Paging information
}

export interface responseListProductVariants {
    code: number
    result: {
        sync_product: SyncProduct
        sync_variants: Array<SyncVariant>
    }
    extra: any[]
    debug: any[]
}