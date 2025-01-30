import Cart, { CartItem } from './cart'

//#region  Payment  Class
/**
 * @param reference  unique identifier for the transaction.
 * @param authEmail customer's email address.
 * @param items items inthe user's Cart

 */

export default class Payment {
    constructor( public reference: string, public authEmail: string, public items: Cart = new Cart() ) {}

    /**
     * Adds an item to the 'shopping cart'
     * @param title
     * @param amount
     */
    add(title: string, amount: number, quantity? : number): Payment {
      this.items.add(new CartItem(title, amount, quantity))
      return this;
    }
  
    info(): string {
      return this.items.summary();
    }
  
    /**
     * Get the total of the items in the cart
     * @returns {*|number}
     */
    total(): number {
      return this.items.getTotal();
    }
  }
  
  //#endregion
