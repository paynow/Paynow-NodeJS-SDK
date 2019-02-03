import { CartItem } from '../src/types/cart';

test('CartItem is 1 if quantity is not added', () => {
    let cartItem = new  CartItem("Item", 10);
    expect(cartItem.quantity).toBe(1);
});
