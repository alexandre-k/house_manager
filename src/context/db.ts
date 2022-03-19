import Dexie, { Table } from 'dexie';

export interface Receipt {
    id?: number;
    amount: number;
    date: number;
    receiptImageId: number;
    category: string;
    dbType: string;
    userId: number;
}

export interface User {
    id?: number;
    username: string;
    pubKey: string;
    dbType: string;
}

export interface ReceiptImage {
    id?: number;
    name: string;
    content: Uint8Array;
    imageType: string;
    imageSize: number;
    dbType: string;
}

export class HouseManager extends Dexie {
    receipts !: Table<Receipt>;
    receiptImages !: Table<ReceiptImage>;
    users !: Table<User>;

    constructor() {
        super('houseManager');
        this.version(4).stores({
            users: '++id, name, pubkey',
            receiptImages: '++id',
            receipts: '++id, receiptImageId, userId, category, date'
        })
    }
}

export const db = new HouseManager();
