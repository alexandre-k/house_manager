import { box, hash, randomBytes, sign } from 'tweetnacl';
import { decodeBase64, encodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';
import { HouseManager, KeyPair, Receipt } from '../context/db';

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

export const toHex = (buf: Uint8Array) => Buffer.from(buf).toString('hex')

export const serializeNoncePubKey = (nonce: Uint8Array, publicKey: Uint8Array) => {
    if (!nonce || !publicKey) return { publicKey: '', nonce: '' }
    return {
        nonce: encodeBase64(nonce),
        publicKey: encodeBase64(publicKey)
    };
}
export const deserializeNoncePubKey = (nonce: string, publicKey: string) => ({
    nonce: decodeBase64(nonce) || "",
    publicKey: decodeBase64(publicKey) || ""
});

export const fromBase64 = (str: string) => decodeBase64(str);
export const toBase64 = (bytes: Uint8Array) => encodeBase64(bytes);

export const generateKeyPair= async (db: HouseManager) => {
    const keyPairs = await db.keys.toArray();
    const keyPair = keyPairs.pop()

    if (!keyPair || !keyPair.publicKey || !keyPair.secretKey) {
        // create default
        const keyPair = box.keyPair();
        const nonce = randomBytes(16);
        const encryptionKeys = {
            publicKey: keyPair.publicKey as Uint8Array,
            secretKey: keyPair.secretKey as Uint8Array,
            nonce: nonce as Uint8Array,
            account: encodeBase64(keyPair.publicKey)
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



export const verifyReceipt = async (receipt: HashedReceipt, keyPair: KeyPair) => {
    const targetReceipt = {
        date: receipt.date,
        category: receipt.category,
        amount: receipt.amount,
        userAddress: receipt.userAddress,
        imageName: receipt.imageName,
        imageType: receipt.imageType
    }
    const hash = await getHash(targetReceipt);
    const signature = getSignature(keyPair, hash);
    // return EthCrypto.recover(signature, hash);
    return true;
}

export const getHash = (receipt: HashedReceipt) =>
    hash(decodeUTF8(JSON.stringify(receipt)));

export const arrayToHex = (arr: Uint8Array) =>
    Array.from(arr).map((b: number) => b.toString(16).padStart(2, "0")).join("");

// export const getHash = async (receipt: HashedReceipt): Promise<ArrayBuffer> =>
//     await Hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(receipt))))

export const toBytes = (decodedMessage: Uint8Array): string => encodeUTF8(decodedMessage);

export const getSignature = (keyPair: KeyPair, hash: Uint8Array) => {
    return sign(hash, keyPair.secretKey);
}

export const generateNonce = (): Uint8Array => randomBytes(24);

// @ts-ignore
export const encryptReceipts = (targetReceipts: Array<Receipt>, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array) => {
    return box(
        decodeUTF8(JSON.stringify(targetReceipts)),
        nonce,
        publicKey,
        secretKey
    );
}

export const decryptReceipts = (body: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array) => {
    const decryptedBody = box.open(
        body,
        nonce,
        publicKey,
        secretKey
    );

    if (!decryptedBody) return null;
    return encodeUTF8(decryptedBody);
}
