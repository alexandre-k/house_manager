import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import QrCode from '../components/QrCode';
import { useHouseManager, Key, Receipt } from '../context/db';
import { deserializeNoncePubKey, encryptReceipts, formatAddress, serializeNoncePubKey, toBase64, toHex } from '../utils/key';
import QrCodeScanner from '../components/QrCodeScanner';
import { s3 } from '../context/filebase';

interface SendProps {
    publicKey: Uint8Array;
    setPublicKey: (publicKey: Uint8Array) => void;
    nonce: Uint8Array;
    setNonce: (nonce: Uint8Array) => void;
}

function Send({ publicKey, setPublicKey, nonce, setNonce }: SendProps) {
    const { db, keyPair } = useHouseManager();
    const { nonce: nonceParam, toPublicKey: publicKeyParam } = useParams()
    const [uploadReceipts, setUploadReceipts] = useState<boolean>(true);
    const [uploadImages, setUploadImages] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);

    useEffect(() => {
        if (publicKeyParam && nonceParam) {
            const result = deserializeNoncePubKey(nonceParam, publicKeyParam)
            setPublicKey(result.publicKey);
            setNonce(result.nonce);
        }
    }, [nonceParam, publicKeyParam])

    const exportReceipts = async () => {
        const receipts = await db
            .receipts
            .toArray()
        if (!receipts) {
            alert('No receipts found');
            return;
        }
        const targetReceipts = receipts.map((r: Receipt) => {
            if (uploadReceipts && !uploadImages) {
                return {
                    hash: r.hash,
                    amount: r.amount,
                    date: r.date,
                    category: r.category,
                    publicKey: r.publicKey
                }
            } else if (!uploadReceipts && uploadImages) {
                return {
                    hash: r.hash,
                    publicKey: r.publicKey,
                    imageDataUrl: r.imageDataUrl,
                    imageName: r.imageName,
                    imageType: r.imageType
                }
            } else {
                return {
                    amount: r.amount,
                    date: r.date,
                    category: r.category,
                    hash: r.hash,
                    publicKey: r.publicKey,
                    imageDataUrl: r.imageDataUrl,
                    imageName: r.imageName,
                    imageType: r.imageType
                }
            }
            });
        try {
            setLoading(true);
            if (!nonce || !publicKey) throw new Error('Invalid nonce or public key');
            const encryptedReceipts = encryptReceipts(targetReceipts, nonce, publicKey, keyPair.secretKey)

            const params = {
                Bucket: 'kakeibo-skynet',
                Key: toHex(publicKey),
                ContentType: 'application/json',
                Body: encryptedReceipts,
                ACL: 'public-read'
            };

            const request = s3.putObject(params);
            const response = await request.send();
        } catch (err) {
            console.log(err);
            alert(err);
        }
        setLoading(false);
    }

    return (
        <div className="grid m-2">
            <div className="col-12 md:col-12">
                <QrCodeScanner
                    nonce={nonce}
                    setNonce={setNonce}
                    publicKey={publicKey}
                    setPublicKey={setPublicKey}
                />
            </div>
        <div
        className="flex align-content-center justify-content-center col-12 md:col-12">
                <Button
                    className="p-button-rounded p-button-secondary"
                    icon="pi pi-send"
                    loading={loading}
                    onClick={exportReceipts} />
             </div>
        </div>
    )
}


export default Send;
