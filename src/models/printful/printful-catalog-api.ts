interface Product {
    id: number          // Product ID
    type: string	    // Product type identifier
    type_name: string	// Product type name
    brand: string	    // Brand name
    model: string	    // Model name
    image: string	    // URL of a sample image for this product
    variant_count: number	     // Number of available variants for this product
    currency: string	         // Currency in which prices are returned
    // files: FileType [ ]	         // Definitions of Print/Mockup file categories that can be attached to this product
    // options: OptionType [ ]	     // Definitions of additional options that are available for this product
    is_discontinued: boolean	 // If product is disabled in push
    avg_fulfillment_time: number // Average number of days for order to be fulfilled
    description: string	         // Product description
}

export interface Variant {
    id: number              // Variant ID, use this to specify the product when creating orders
    product_id: number      // ID of the product that this variant belongs to
    name: string	        // Display name
    size: string	        // Item size
    color: string	        // Item color
    color_code: string	    // Hexadecimal RGB color code. May not exactly reflect the real-world color
    color_code2: string	    // Secondary hexadecimal RGB color code. May not exactly reflect the real-world color
    image: string	        // URL of a preview image for this variant
    price: string	        // Variant's price (can change depending on print files and optional settings)
    in_stock: boolean	    // Stock availability of this variant
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
 * FINAL RESPONSES /  REQUESTS ORDER COSTS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export interface ResponseVariant {
    code: number            // Response status code 200
    result: {
        variant: Variant	// Information about the selected Variant
    }
}

export interface ResponseAllProductVariant {
    code: number                   // Response status code 200
    result: {
        product: Product	       // Information about the selected product
        variants: Array<Variant>   // [ ] Array of Variants available for the selected product
    }
}