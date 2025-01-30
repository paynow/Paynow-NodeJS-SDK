import Payment from '../src/types/payment'

let payment = new Payment("test-reference", "pay@abc.xyz");

test('Payment Type Instantiation', () => {
    expect(payment).toBeInstanceOf(Payment);
});

test('Cart Instatiation on Payment Type', () =>{
    expect(payment.items).toBeDefined();
})

test('If you can add items to the the cart', () => {
    let initialCartLength = payment.items.length();
    payment.add("Test Item", 10, 1);
    let cartLength = payment.items.length();
    expect(initialCartLength).toBeLessThan(cartLength);
})
