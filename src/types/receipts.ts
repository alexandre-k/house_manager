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
    image_data_url: string;
    amount: number;
    date: number;
    category: string;
    public_key: string;
    image_name: string;
    image_type: string;
}
