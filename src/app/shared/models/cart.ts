import { nanoid } from 'nanoid';

export type CartType = {
    id: string;
    items: CartItemType[];
    deliveryMethodId? : number;
    paymentIntentId?: string;
    clientSecret?: string;
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
    id: string = nanoid();
    items: CartItemType[] = [];
    deliveryMethodId? : number;
    paymentIntentId?: string;
    clientSecret?: string; 
}


