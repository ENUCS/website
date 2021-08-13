/**
 * Data Interface for the API
 * in the Orders API for Printful
 * ------
 * https://www.printful.com/es/docs/shipping
*/

export interface ItemInfo {
    variant_id: string	                    // Catalog Variant ID of the item ordered. See Product Catalog API
    external_variant_id: string	            // (* Required if no other IDs given) External Variant ID of the item ordered. See Ecommerce Platform Sync API.
    warehouse_product_variant_id: string	// (* Required if no other IDs given) Warehouse product variant ID of the item ordered. See Warehouse Products API.
    quantity: number                    	// (* Required if no other IDs given) Number of items ordered
    value?: string	                        // Item retail value - optional but can help to properly calculate insurance costs for large orders
}

export interface UserAddressInfo {
    address1: string        // Address line 1
    city: string            // City
    country_code: string    // Country code
    state_code?: string     // State code (optional, required for United States, Australia and Canada)
    zip?: string            // ZIP or postal code (optional, required for some countries to calculate expedited shipping rates)
    phone?:	string	        // Phone number (optional)
}

export interface ShippingInfo {
    id: string	                // Shipping method ID
    name: string	            // Shipping method name
    rate: string	            // Shipping rate
    currency: string	        // Currency code in which the rate is returned
    minDeliveryDays: number     // Estimated minimum delivery days. Warning this value may not be present in response.
    maxDeliveryDays: number     // Estimated maximum delivery days. Warning this value may not be present in response.
    locale: string	            // Locale in which shipping rate names will be returned. Available options - 'en_US' (default), 'es_ES'
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
 * FINAL RESPONSES /  REQUESTS ORDER COSTS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export interface RequestShippingRates {
    recipient: UserAddressInfo          // Recipient location information
    items: Array<ItemInfo>              // Array of order items
    currency?: string	                // 3 letter currency code (optional), required if the rates need to be converted to another currency instead of store default currency
    locale?: string	                    // Locale in which shipping rate names will be returned. Available options - 'en_US' (default), 'es_ES'
}

export interface ResponseShippingRates {
    code: number                        // Response status code 200
    result: Array<ShippingInfo>         // ShippingInfo
}