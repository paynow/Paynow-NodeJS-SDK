import { CartItem } from '../src/types/cart';

test('CartItem is 1 if quantity is not added', () => {
    let cartItem = new  CartItem("Item", 10);
    expect(cartItem.quantity).toBe(1);
});

test('CartItem takes value given in constructor if available', () =>{
    let cartItem = new CartItem("Item", 10, 5);
    expect(cartItem.quantity).toBe(5);
})
