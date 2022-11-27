import react, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Card } from 'primereact/card';
import { categoryColors } from '../utils/categories';
import { formatAddress } from '../utils/key';
import { KeyPair, useHouseManager } from '../context/db';
const accounting = require("accounting");
import { DisplayedReceipt, RawReceipt } from '../types/receipts';
import AddReceiptButton from '../components/AddReceiptBtn';
import { useQuery } from '@tanstack/react-query';


type Props = {
    isAddingReceipt: boolean;
    setIsAddingReceipt: (isAddingReceipt: boolean) => void;
    receipts: DisplayedReceipt[];
    setReceipts: (receipts: DisplayedReceipt[]) => void
}

function Receipts({ isAddingReceipt, setIsAddingReceipt, receipts, setReceipts }: Props) {
    const { date, keyPair } = useHouseManager();

    const minDate = date;
    const maxDate = date + 24 * 60 * 60;

    const { isLoading, error, data } = useQuery({
        queryKey: ['receipts', {
            minDate: minDate.toString(),
            maxDate: maxDate.toString()
        }],
        queryFn: () =>
            fetch('/api/receipts?' + new URLSearchParams({
                minDate: minDate.toString(), maxDate: maxDate.toString()
                }).toString()).then(async res => {
                    const { data } = await res.json()
                    if (!data) return []
                    const found: DisplayedReceipt[] = data.map((r: RawReceipt) => {
                        return {
                            date: r.date,
                            amount: r.amount,
                            category: r.category,
                            hash: r.hash,
                            imageDataUrl: r.image_data_url,
                            imageName: r.image_name,
                            imageType: r.image_type,
                            publicKey: r.public_key,
                        }
                    })
                    setReceipts(found)
                    return data
            })
    });

    const header = (receipt: DisplayedReceipt) => {
        return (
            <div className="p-col-12 grid p-fluid p-jc-between">
                <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger m-1"
                    onClick={() => {
                        console.log('TODO: remove receipt')
                        // db.receipts.where({ hash: receipt.hash }).delete()
                        // setReceipts(receipts.filter(r => r.hash !== receipt.hash))
                    }} />
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info m-1"
                onClick={() => {
                    console.log('edit')
                }}
            />
            </div>
        );
    }

    const isOwnReceipt = (signAddress: string, account: string | undefined) => {
        if (!account) return false;
        return signAddress === account;
    }

    const subTitle = (receipt: DisplayedReceipt, keyPair: KeyPair) =>
        'By ' + formatAddress(keyPair.account) + isOwnReceipt('', keyPair.account) ?
        ' Verified by me' : ''


    const receiptDataUrl = (receipt: DisplayedReceipt) => {
        console.log('RECEIPT > ', receipt)
        if (receipt.imageDataUrl && receipt.imageDataUrl.length > 0) {
            return receipt.imageDataUrl;
        } else {
            return '/images/' + receipt.category + '.jpg';
        }
    }
    if (receipts.length === 0) {
        return (<Card className="p-shadow-0">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  }}>
                <div style={{ margin: '10px' }}>
                Add receipts by clicking plus button
                </div>
                <AddReceiptButton
                    isAddingReceipt={isAddingReceipt}
                    onAddReceipt={() => setIsAddingReceipt(!isAddingReceipt)}
                />
            </div>
        </Card>);
    }


    return (
        <div className="grid p-fluid p-jc-between">
            {receipts.map((receipt: DisplayedReceipt, index: number) => (<div key={index} className="p-col-6 p-sm-6">
                <Card
                    className="p-shadow-24"
                    header={() =>  header(receipt)}
                    title={accounting.formatMoney(receipt.amount, { symbol: '¥' })}
                    subTitle={subTitle(receipt, keyPair)}
                    style={{ height: '100%', background: categoryColors[receipt.category] }}>
                    <p>{}</p>
                    <Image
                        className="p-shadow-1"
                        src={receiptDataUrl(receipt)}
                        height="100%"
                        width="100%"
                    />
                </Card>
            </div>
            ))}
        </div>
    );
}


export default Receipts;
