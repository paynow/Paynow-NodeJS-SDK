import { Cart, CartItem } from "../src/components/cart"

describe("Test Cart functionality", () => {
    it("Create new cart", () => {
        const myCart = new Cart()
        expect(myCart).toBeInstanceOf(Cart)
    })

    it("Should add cart items", () => {
        const cartItems: CartItem[] = [
            { title: "item1", amount: 10, quantity: 2 },
            { title: "item2", amount: 5, quantity: 2 },
            { title: "item3", amount: 20, quantity: 1 }
        ]

        const myCart1 = new Cart(cartItems)
        expect(myCart1.length()).toBe(3)
        expect(myCart1.getTotal()).toBe(50)
        expect(myCart1.summary()).toEqual("item1, item2, item3")

        const myCart2 = new Cart()
        for (let i = 0; i < cartItems.length; i++ ) { 
            myCart2.add(cartItems[i]) 
        }
        expect(myCart2.length()).toBe(3)
        expect(myCart2.getTotal()).toBe(50)
        expect(myCart2.summary()).toEqual("item1, item2, item3")
    })
})