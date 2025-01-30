//#region CartItem Class
/**
 *  @param title the name of the cart item 
 * 
 * @param amount the cost of a single unit of the item
 * 
 * @param quantity the number of units of the item 
 */
export class CartItem {
    constructor(public title: string, public amount: number, public quantity: number = 1 ) {}
  }
  
  //#endregion

  //#region 

export default class Cart {
    public items : CartItem[] = [];
    constructor(_items?: CartItem[] ){
        if (_items){
            _items.forEach( thing => { this.items.push(thing) });
        } 
    }
    length() : number {
         return this.items.length;
    }
  
    add(item:CartItem){
      this.items.push(item);
      return this.items.length 
    }
  
    getTotal(): number {
      let cartTotal: number = 0;
      this.items.forEach((item: CartItem) => {
        cartTotal +=  item.amount *  item.quantity;
      });
      return cartTotal;
    }
  
    summary(): string{
      let summary = "";

      this.items.forEach(function(item, index) {
          summary = summary.concat(item.title + ", ");
      })
      // console.log(summary, this.items);

      summary = summary.substr(0, summary.length - 3);


      return summary;
    }
  
  
  }
  //#endregion