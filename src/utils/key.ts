var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');
import { HouseManager, KeyPair } from '../context/db';

export type HashedReceipt = {
    amount: number;
    date: number;
    category: string;
    userAddress: string;
    imageName: string;
    imageType: string;
}

export const formatAddress = (account: string | undefined) => {
    if (!account) return 'Not connected';
    return account.substring(0, 5) + '...' + account.substring(37, 42);
}

export const serializeKeyPair = (keyPair: KeyPair) => {
    const nonce = nacl.util.encodeBase64(keyPair.nonce);
    const publicKey = nacl.util.encodeBase64(keyPair.publicKey);
    return { publicKey, nonce };
}

export const generateKeyPair= async (db: HouseManager) => {
    const keyPairs = await db.keys.toArray();
    const keyPair = keyPairs.pop()
    if (!keyPair || !keyPair.publicKey || !keyPair.secretKey) {
        // create default
        const keyPair = nacl.box.keyPair();
        const nonce = nacl.randomBytes(16);
        const encryptionKeys = {
            publicKey: keyPair.publicKey as Uint8Array,
            secretKey: keyPair.secretKey as Uint8Array,
            nonce: nonce as Uint8Array,
            account: nacl.util.encodeBase64(keyPair.publicKey)
        }
        if (keyPair.publicKey) {
            await db.keys.put(encryptionKeys, keyPair.publicKey);
        } else {
            await db.keys.add(encryptionKeys);
        }
        return encryptionKeys;
    }
    return keyPair;
}



export const verifyReceipt = (receipt: HashedReceipt, keyPair: KeyPair) => {
    const targetReceipt = {
        date: receipt.date,
        category: receipt.category,
        amount: receipt.amount,
        userAddress: receipt.userAddress,
        imageName: receipt.imageName,
        imageType: receipt.imageType
    }
    const hash = getHash(targetReceipt);
    const signature = getSignature(keyPair, hash);
    // return EthCrypto.recover(signature, hash);
    return true;
}

export const getHash = (receipt: HashedReceipt) => {
    return nacl.hash(nacl.util.decodeUTF8(JSON.stringify(receipt)));
}

export const getSignature = (keyPair: KeyPair, hash: string) => {
    return nacl.sign(hash, keyPair.secretKey);
}
