//#region CartItem Class
/**
 *  @param title the name of the cart item 
 * 
 * @param amount the cost of a single unit of the item
 * 
 * @param quantity the number of units of the item 
 */
export class CartItem {
    constructor(public title: string, public amount: number, public quantity? : number ) {}
  }
  
  //#endregion

  //#region 

export default class Cart {

    constructor( public items: CartItem[] ){}
    length = this.items.length;
  
    addTo(item:CartItem){
      this.items.push(item);
      return this.items.length 
    }
  
    getTotal(): number {
      let cartTotal: number;
      this.items.forEach((item: CartItem) => {
        (item.quantity)? cartTotal +=  item.amount *  item.quantity : cartTotal += item.amount
      });
      return cartTotal;
    }
  
    summary(): string{
      return this.items.join(', ')
    }
  
  
  }
  //#endregion