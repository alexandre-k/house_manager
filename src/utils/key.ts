import EthCrypto from 'eth-crypto';
import { Account } from 'web3-core';

export type HashedReceipt = {
    amount: number;
    date: number;
    category: string;
    userAddress: string;
    imageName: string;
    imageType: string;
}

export const formatAddress = (accounts: string[] | undefined) => {
    if (!accounts) return 'Not connected';
    const account = accounts[0]
    if (!account) return 'Not connected';
    return account.substring(0, 5)+ '...' + account.substring(37, 42);
}

export const verifyReceipt = (receipt: HashedReceipt, privateKey: string) => {
    const targetReceipt = {
        date: receipt.date,
        category: receipt.category,
        amount: receipt.amount,
        userAddress: receipt.userAddress,
        imageName: receipt.imageName,
        imageType: receipt.imageType
    }
    const hash = getHash(targetReceipt);
    const signature = getSignature(hash, privateKey);
    return EthCrypto.recover(signature, hash);
}

export const getHash = (receipt: HashedReceipt) => {
    return EthCrypto.hash.keccak256(JSON.stringify(receipt));
}

export const getSignature = (hash: string, privateKey: string) => {
    return EthCrypto.sign(privateKey, hash);
}
