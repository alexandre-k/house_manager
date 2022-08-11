import react, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import { Card } from 'primereact/card';
import { getTimestamp } from '../utils/date';
import { categoryColors } from '../utils/categories';
import { formatAddress, HashedReceipt, verifyReceipt } from '../utils/key';
import { useHouseManager, Receipt } from '../context/db';
const accounting = require("accounting");
import { web3 } from '../context/crypto';
import { Account } from 'web3-core'
import { DisplayedReceipt } from '../types/receipts';
import AddReceiptButton from '../components/AddReceiptBtn';


type Props = {
    isAddingReceipt: boolean;
    setIsAddingReceipt: (isAddingReceipt: boolean) => void;
    receipts: DisplayedReceipt[];
    setReceipts: (receipts: DisplayedReceipt[]) => void
}

function Receipts({ isAddingReceipt, setIsAddingReceipt, receipts, setReceipts }: Props) {
    const { db, date } = useHouseManager();
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<string[]>([]);
    useEffect(() => {
        const getAccounts = async () => {
            const requestedAccounts = await web3.eth.requestAccounts()
            const accounts = await web3.eth.getAccounts();
            setAccounts(accounts);
        }
        getAccounts();

        const allReceipts = async () => {
            if (!date) return []
            const result = await db
                .receipts
                .where('date')
                .between(date, date + 24 * 60 * 60)
                .toArray();
            if (!result) return []
            const found: DisplayedReceipt[] = result.map((r: Receipt) => {
                const blob = new Blob([r.imageBuffer], { 'type': r.imageType })
                const url = URL.createObjectURL(blob);
                return { ...r, dataUrl: url };
            })
            setReceipts(found)
        }
        if (!isAddingReceipt) allReceipts()
    }, [isAddingReceipt])
    const header = (receipt: DisplayedReceipt) => {
        return (
            <div className="p-col-12 grid p-fluid p-jc-between">
                <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger m-1"
                    onClick={() => {
                        db.receipts.where({ hash: receipt.hash }).delete()
                        setReceipts(receipts.filter(r => r.hash !== receipt.hash))
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

    const recoverAddress = (receipt: DisplayedReceipt) => {
        if (accounts === []) return '';
        return '';
    }

    const isOwnReceipt = (signAddress: string, account: string[] | undefined) => {
        if (!account || !account[0]) return false;
        return signAddress === accounts[0];
    }

    const subTitle = (receipt: DisplayedReceipt) => 'By ' + formatAddress(accounts) + isOwnReceipt(recoverAddress(receipt), accounts) ? ' Verified by me' : ''


    const receiptDataUrl = (receipt: DisplayedReceipt) => {
        if (receipt.imageBuffer && receipt.imageBuffer.length > 0) {
            return receipt.dataUrl;
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
                    subTitle={subTitle(receipt)}
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
