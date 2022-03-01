export declare class CartItem {
    title: string;
    amount: number;
    quantity: number;
    constructor(title: string, amount: number, quantity?: number);
}
export default class Cart {
    items: CartItem[];
    constructor(_items?: CartItem[]);
    length(): number;
    add(item: CartItem): number;
    getTotal(): number;
    summary(): string;
}
