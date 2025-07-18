import { nanoid } from 'nanoid';

export type CartType = {
    id: string;
    items: CartItemType[];
}

export type CartItemType = {
    productId: number;
    productName: string;
    price : number;
    quantity: number;
    imageUrl: string;
    brand: string;
    type: string;
};

export class Cart implements CartType {
    id: string;
    items: CartItemType[];

    constructor(items: CartItemType[] = []) {
        this.id = nanoid();
        this.items = items;
    }
}

// function nanoid(): string {
//     // Generates a simple unique id using current timestamp and random number
//     return 'cart_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
// }


