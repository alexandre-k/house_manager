import Dexie, { Table } from 'dexie';
import { createContext, useContext } from 'react';

export interface Receipt {
    amount: number;
    date: number;
    category: string;
    hash: string;
    userAddress: string;
    imageBuffer: Uint8Array;
    imageName: string;
    imageType: string;
}

export interface TempReceipt {
    amount: number;
    date: number;
    category: string;
    hash: string;
    userAddress: string;
    imageBuffer: Uint8Array;
    imageName: string;
    imageType: string;
}

export interface Key {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
    nonce: Uint8Array;
    account: string;
}

export class HouseManager extends Dexie {
    receipts !: Table<Receipt>;
    tempReceipts !: Table<TempReceipt>;
    keys!: Table<Key>;

    constructor() {
        super('houseManager');
        this.version(16).stores({
            keys: 'publicKey',
            receipts: 'hash, amount, category, date, userAddress',
            tempReceipts: 'hash, amount, category, date, userAddress'
        })
    }
}

export interface KeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
    nonce: Uint8Array;
    account: string;
}

interface IHouseManagerContext {
    db: HouseManager;
    setDate: (date: number) => void;
    date: number;
    keyPair: KeyPair
}

export const HouseManagerContext = createContext(null as any);

export const useHouseManager = () => {
  return useContext(HouseManagerContext);
}
