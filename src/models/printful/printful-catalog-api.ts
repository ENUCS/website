interface Variant {
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