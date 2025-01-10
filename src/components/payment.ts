import { Cart, CartItem } from './cart'


/**
 * Payment
 * 
 * @param reference  unique identifier for the transaction.
 * @param authEmail customer's email address.
 * @param cart user's Cart (default is new empty cart)
 *
 */

export class Payment {
    constructor(
        public reference: string,
        public authEmail: string,
        public cart: Cart = new Cart()) { }

    /**
     * 
     * Adds an item to the 'shopping cart'
     * @param title name of item to be added to cart
     * @param amount price of item to be added to cart
     * @param quantity (optional) quantity, default is 1
     * 
     */
    add(title: string, amount: number, quantity?: number): void {
        this.cart.add(new CartItem(title, amount, quantity))
    }

    /**
     * List all items in the cart
     * @returns {string}
     * 
     */
    info(): string {
        return this.cart.summary();
    }

    /**
     * Get the total price of the items in the cart
     * @returns {number}
     * 
     */
    total(): number {
        return this.cart.getTotal();
    }
}