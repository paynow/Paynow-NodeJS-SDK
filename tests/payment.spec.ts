import { Payment } from "../src/components/payment"
import { Cart, CartItem } from "../src/components/cart"

describe("Test Payment functionality", () => {
    it("should create new payment", () => {
        const payment = new Payment("my-reference", "tpp@pfitz.co.zw")

        expect(payment).toBeInstanceOf(Payment)
        expect(payment.reference).toEqual("my-reference")
        expect(payment.authEmail).toEqual("tpp@pfitz.co.zw")
        expect(payment.total()).toBe(0)
        expect(payment.cart.length()).toBe(0)
    })

    it("should create new payment with cart", () => {
        const cartItems: CartItem[] = [
            { title: "item1", amount: 10, quantity: 2 },
            { title: "item2", amount: 5, quantity: 2 },
            { title: "item3", amount: 20, quantity: 1 }
        ]

        const cart = new Cart(cartItems)

        const payment = new Payment("my-reference", "tpp@pfitz.co.zw", cart)

        expect(payment).toBeInstanceOf(Payment)
        expect(payment.reference).toEqual("my-reference")
        expect(payment.authEmail).toEqual("tpp@pfitz.co.zw")
        expect(payment.total()).toBe(50)
        expect(payment.cart.length()).toBe(3)
    })

    it("should add items to payment", () => {
        const cartItems: CartItem[] = [
            { title: "item1", amount: 10, quantity: 2 },
            { title: "item2", amount: 5, quantity: 2 },
            { title: "item3", amount: 20, quantity: 1 }
        ]

        const payment = new Payment("my-reference", "tpp@pfitz.co.zw")

        expect(payment).toBeInstanceOf(Payment)
        expect(payment.reference).toEqual("my-reference")
        expect(payment.authEmail).toEqual("tpp@pfitz.co.zw")

        payment.add(cartItems[0].title, cartItems[0].amount, cartItems[0].quantity)
        payment.add(cartItems[1].title, cartItems[1].amount, cartItems[1].quantity)
        payment.add(cartItems[2].title, cartItems[2].amount)

        expect(payment.total()).toBe(50)
        expect(payment.cart.length()).toBe(3)
        expect(payment.info()).toEqual("item1, item2, item3")
    })
})