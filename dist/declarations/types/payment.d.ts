import Cart from './cart';
export default class Payment {
    reference: string;
    authEmail: string;
    items: Cart;
    constructor(reference: string, authEmail: string, items?: Cart);
    add(title: string, amount: number, quantity?: number): Payment;
    info(): string;
    total(): number;
}
