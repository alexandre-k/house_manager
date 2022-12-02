export type DisplayedReceipt = {
    hash: string;
    imageDataUrl: string;
    amount: number;
    date: number;
    category: string;
    userAddress: string;
    imageName: string;
    imageType: string;
}

export type RawReceipt = {
    hash: string;
    amount: number;
    date: number;
    category: string;
    publicKey: string;
    imageName: string;
    imageType: string;
}
