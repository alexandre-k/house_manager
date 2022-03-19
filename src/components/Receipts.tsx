import react, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import { Card } from 'primereact/card';
import { db } from '../context/db';
import { getTimestamp } from '../utils/date';
import { categoryColors } from '../utils/categories';


type Props = {
    date: number;
    isAddingReceipt: boolean;
}

type DisplayedReceipt = {
    id?: number;
    dataUrl: string;
    amount: number;
    date: number;
    receiptImageId: number;
    category: string;
    dbType: string;
    userId: number;
}

function Receipts({ date, isAddingReceipt }: Props) {
    const [receipts, setReceipts] = useState<DisplayedReceipt[]>([]);
    useEffect(() => {
        const allReceipts = async () => {
            if (!date) return []
            const result = await db
                .receipts
                .where({ date })
                .toArray();
            if (!result) return []
            const found: DisplayedReceipt[] = await Promise.all(result.map(async r => {
                const image = await db.receiptImages.where({ id: r.receiptImageId }).first()
                if (image) {
                    const blob = new Blob([image.content.buffer], { 'type': image.imageType })
                    const url = URL.createObjectURL(blob);
                    console.log('url > ', url)
                    return { ...r, dataUrl: url };
                } else {
                    return { ...r, dataUrl: '' };
                }
            }))
            console.log('found > ', found)
            setReceipts(found)
        }
        if (!isAddingReceipt) allReceipts()
    }, [isAddingReceipt])
    const header = (
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={() => console.log('Delete !') } />
    );
    return (
        <div className="grid p-fluid p-jc-between">

            {receipts.map((receipt: DisplayedReceipt, index: number) => {
            return <div key={index} className="p-col-6 p-sm-6">
                <Card className="p-shadow-24" header={header} style={{ height: '100%', background: categoryColors[receipt.category] }}>
                    <Image className="p-shadow-1" src={receipt.dataUrl} height="100%" width="100%" />
                    <p>{receipt.amount}</p>
                </Card>
            </div>
            })}
        </div>
    );
}


export default Receipts;
