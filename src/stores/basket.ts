import { writable } from "svelte/store";

import type { SyncVariant } from "../models/printful/proucts_printful";

let productCartMap = new Map();

interface productCart {
  cartItems: Array< SyncVariant >,
  cartItemsQty: number
}

let product_cart: productCart = {
    cartItems: undefined,
    cartItemsQty: 0,
  }

/**
 *
 * @param {*} key
 * @returns
 */
function createLocalStore(key) {
  const { subscribe, set, update } = writable(product_cart);

  return {
    subscribe,
    set,
    update,

    /**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
     * Method to add items to cart,
     * and updating a particular item's
		 * quantity if it already exists in the 
		 * .localStorage() cart-array, otherwise, 
		 * simply adds the new item to the cart-array.
     * [WORKING]
     *
     * @param {*} item
		*/
    addToCart: (item) => {
			// console.log(item)

      // get the existing data, stored in the .localStorage();
      var existing: string = localStorage.getItem(key);

      // if `existing data` is `none`, create an array;
      // otherwise, convert the .localStorage() string to an array,
      let existingData: productCart = existing
        ? JSON.parse(existing)
        : {
            cartItems: [],
            cartItemsQty: 0
          };

      let changed = false;
      let object;
			
			// search for this item in the cart .localStorage() already;
      const newCartMap = existingData.cartItems.map((p) => {
				// if it exists,
        if (p.sku === item.sku) {
					// toggle the `changed` variable to `true`;
          changed = true;
        }
				// 
        object =
          p.sku === item.sku
            ? {
                ...p,
                quantity: p.quantity + item.quantity,
              }
            : p;
        return object;
      })

      // if the item already exists in the .localStorage();
      if (changed) {
				// update the data with new data;
        existingData.cartItems = newCartMap;
      } else {
				// otherwise, add the new item to the cart-array;
        existingData.cartItems.push(item);
      }

      // update the total cart quantity;
      existingData.cartItemsQty = existingData.cartItemsQty + item.quantity

      // save back to .localStorage() as a JSON-string;
      localStorage.setItem(key, JSON.stringify(existingData))

      // update and save the data to set({})
      set(existingData)
    },

    /**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * [START]
     * Method for rendering the .localStorage() form
		 * the start of the page
		*/
    useLocalStorage: () => {
      // reset the writable to the localStorage if localStorage already exists,
      var existing: string = localStorage.getItem(key);

      let existingData: productCart = existing
        ? JSON.parse(existing)
        : {
            cartItems: [],
            cartItemsQty: 0
          };

      set(existingData);
    },

    /**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
     * Method / function to remove 
		 * target item from the basket
     * [WORKING]
     *
     * @param {*} sku_num
		*/
    removeItem: (sku_num) => {
      // locate the target SKU value item,
      var existing: string = localStorage.getItem(key);

      let existingData: productCart = existing
      ? JSON.parse(existing)
      : {
          cartItems: [],
          cartItemsQty: 0
        };

      // iterate over array of cart items,
      let i = 0;

      existingData.cartItems.forEach((element) => {
        // remove it from the persistance method,
        if (element.sku === sku_num) {

          // update the TOTAL PRODUCT QUANTITY,
          existingData.cartItemsQty = existingData.cartItemsQty - element.quantity
          
          existingData.cartItems.splice(i, 1);
        }
        i = i + 1;
      });
      
      localStorage.setItem(key, JSON.stringify(existingData));

      set(existingData);
    },

    /**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
     * Method / function to remove all 
		 * items from the cart,
     *
		*/
    removeAllCartItems: () => {

      localStorage.clear();

      set({
          cartItems: [],
          cartItemsQty: 0
        }
      );
    },
  };
}

// if .localStorage() has the key then it will be used,
// if not the default will be used. Format:
// export const var = createLocalStore(key, default)
export const cart = createLocalStore('enucs-shop-cart');
