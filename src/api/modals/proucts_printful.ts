/**
 * Data Interface for the API
 * in the Products API for Printful
 * ------
 * https://www.printful.com/es/docs/products
*/

/**
 * A Single Sync Product gathered,
 * from the Printful Store / Shop 
*/
interface Page {
    total: number	            // Total number of items available
    offset: number	            // Current result set page offset
    limit: number	            // Max number of items per page
}

/**
 * A Single Sync Product gathered,
 * from the Printful Store / Shop 
*/
export interface SyncProduct {
    id: number	            // Sync Product ID
    external_id: string 	// Product ID from the Ecommerce platform
    name: string	        // Product name
    variants: number	    // Total number of Sync Variants belonging to this product
    synced: number	        // Number of synced Sync Variants belonging to this product
    thumbnail_url?: string	// Thumbnail image for the product
    is_ignored?: boolean 	// Indicates if this Sync Product is ignored
}

/**
 * Get a list of Sync Products
 * from Printful
*/
export interface responseListItems {
    code: number
    result: Array<SyncProduct>
    paging: Page                    // Paging information
}

/**
 * Single Printful File Option
 * INTERFACE 
*/
export interface File {
    type: string 
    preview_url: string // Source URL where the file is downloaded from
 }

/**
 * A Single Sync Product Variant gathered,
 * from Printful Store / Shop 
*/
export interface SyncVariant {
    id: number
    external_id: string
    sync_product_id: number
    name: string
    synced: boolean
    variant_id: number
    retail_price: string
    currency: string
    product: {
        variant_id: number // Variant ID
        product_id: number // Product ID of this variant
        image: string // URL of a sample image for this variant
        name: string // Display name of this variant
    }
    files: Array<File>
}

/**
 *  Get a list of the Single Prouct Variants and Variations
*/
export interface responseListProductVariants {
    code: number
    result: {
        sync_product: SyncProduct
        sync_variants: Array<SyncVariant>
    }
    extra: any[]
    debug: any[]
}