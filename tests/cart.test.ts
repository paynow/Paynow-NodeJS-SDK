import Cart, { CartItem } from '../src/types/cart';

test('CartItem is 1 if quantity is not added', () => {
    let cartItem = new  CartItem("Item", 10);
    expect(cartItem.quantity).toBe(1);
});

test('CartItem takes value given in constructor if available', () =>{
    let cartItem = new CartItem("Item", 10, 5);
    expect(cartItem.quantity).toBe(5);
});

test("Cart Instantiation", () => {
    let cart = new Cart();
    expect(cart.items.length).toBe(0); 
});

test("Adding Items to Cart", () => {
    let cart = new Cart();
    cart.add( new CartItem("Item", 10));
    cart.add( new CartItem("item2", 6));

    expect(cart.items.length).toBe(2);
});

test(" Cart Total Calculation", () => {
    let cart = new Cart();
    cart.add( new CartItem("Item", 10, 5));
    cart.add( new CartItem("item2", 6));

    expect(cart.getTotal()).toBe(56);
});

test("Cart Summary is a string", () => {
    let cart = new Cart();
    cart.add( new CartItem("Item", 10, 5));
    cart.add( new CartItem("item2", 6));

    expect(cart.summary()).toBeTruthy;
});
