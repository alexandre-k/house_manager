import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import QrCode from '../components/QrCode';
import { useHouseManager, Key } from '../context/db';
import { formatAddress, toHex, decryptReceipts } from '../utils/key';
import { s3 } from '../context/filebase';

interface ReceiveProps {
    nonce: Uint8Array;
}


function Receive({ nonce }: ReceiveProps) {
    const { db, keyPair } = useHouseManager();
    const [fromPublicKey, setFromPublicKey] = useState<string>('');
    const getProviderAddress = async () => {
        try {
        } catch (error) {
            console.log('[New Receipts] getAccounts: ', error)
        }
    }

    const downloadData = async () => {
        const params = {
            Bucket: 'kakeibo-skynet',
            Key: toHex(keyPair.publicKey)
        };
        // @ts-ignore
        const request = s3.getObject(params, async (err, data) => {
            if (err) alert(err)
            // create default
            const body = data.Body;

            const decryptedReceipts = decryptReceipts(body, nonce, keyPair.publicKey, keyPair.secretKey);
            try {

                if (!decryptedReceipts) {
                    throw new Error('Unable to decrypt receipts!');
                }
                const receiptId = await db.receipts.bulkAdd(JSON.parse(decryptedReceipts));
            } catch (err) {
                console.log(err)
                alert(err)
            }

        });
        const response = await request.send()
    }

    return (
        <>
            <div className="col-12 md:col-12">
                {keyPair && <QrCode keyPair={keyPair} onClickDownload={() => downloadData()} />}
            </div>
        </>
    )
}

export default Receive;
