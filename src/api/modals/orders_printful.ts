/**
 * Data Interface for the API
 * in the Orders API for Printful
 * ------
 * https://www.printful.com/es/docs/orders 
*/


/**
 * Single Printful File Option
 * INTERFACE 
*/
interface File {
   url: string // Source URL where the file is downloaded from
}


/**
 * Single Printful Item Option
 * INTERFACE 
*/
interface ItemOption {
   id: string // Option ID
   value: any // Option value
}


/**
 * Shipping address
 * INTERFACE 
*/
export interface UserAddress {
   name: string
   email?: string
   address1: string
   city: string
   state_code: string
   country_code: string
   zip: string
}


/**
 * Single Printful Item
 * INTERFACE 
*/
export interface Item {
   name: string                  // Item Name
   id: number                    // Line item ID
   external_id?: number          // Line item ID from the external system
   variant_id: number            // Variant ID of the item ordered. See Products API
   sync_variant_id: number       //	Sync variant ID of the item ordered.
   external_variant_id: string   // External variant ID of the item ordered.
   warehouse_product_variant_id: number  // Warehousing product variant ID of the item ordered. See Warehouse Products API
   quantity: number              // Number of items ordered
   files: Array<File>            // Array of attached printfiles / preview images
   options: Array<ItemOption>    // Array of additional options for this product
   price?: string                // Printful price of the item
   retail_price: string          // Original retail price of the item to be displayed on the packing slip
   product?: string              // Short information about the Product and Variant
   sku?:	string	               // Product identifier (SKU) from the external system
}


/**
 * JSON Request Sample
 * INTERFACE 
*/
export interface NewOrder {
   // urlEndpoint: string       // URL Endpoint for the REQ,
   recipient: UserAddress    // User Shipping Address,
   items: Array<Item>        // Array of items in the order,
}


/**
 * Object CreateNew Order
 * CLASS 
*/
export class createNewOrder {
   urlEndpoint: string       // URL Endpoint for the REQ,
   recipient: UserAddress    // User Shipping Address,
   items: Array<Item>        // Array of items in the order,
  
   constructor(recipient: UserAddress, items: Array<Item>) {
     this.urlEndpoint = 'orders';
     this.recipient = recipient;
     this.items = items
   }

}


/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ESTIMATING ORDER COSTS
 * (BASED ON ORDERS API)
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
*/


/**
 * Costs Information Data
 * INTERFACE 
*/
export interface Costs {
   currency: string	      // 3 letter currency code
   subtotal: string	      // Total cost of all items
   discount: string	      // Discount sum
   shipping: string	      // Shipping costs
   digitization: string	   // Digitization costs
   tax: string	            // Sum of taxes (not included in the item price)
   vat: string	            // Sum of vat (not included in the item price)
   total: string	         // Grand Total (subtotal-discount+tax+vat+shipping)
}


/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
 * FINAL RESPONSES /  REQUESTS ORDER COSTS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
*/


/**
 * JSON Response With
 * Estimate Costs Data
 * INTERFACE 
*/
export interface ResponseEstimateOrderCosts {
   code: number
   result: {
      costs: Costs            // Order costs (Printful prices)
      retail_costs: Costs     // Retail costs that are to be displayed on the packing slip for international shipments. 
                              // Retail costs are used only if every item in order contains the retail_price attribute.
   }
}


/**
 * JSON Request With
 * Asking for an
 * Estimate Order Costs
 * INTERFACE 
*/
export interface RequestEsimateOrderCosts {
   external_id?: string	               // Order ID from the external system
   shipping?: string	                  // Shipping method. Defaults to 'STANDARD'
   recipient: UserAddress	            // Shipping address
   items: Array<Item>	               // Array of items in the order
   retail_costs?: Costs	               // Retail costs that are to be displayed on the packing slip for international shipments. 
                                       // Retail costs are used only if every item in order contains the retail_price attribute.
   // gift?: Gift	                     // Optional gift message for the packing slip
   // packing_slip?: OrderPackingSlip	// Custom packing slip for this order
}