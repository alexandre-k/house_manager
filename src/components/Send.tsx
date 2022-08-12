import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import QrCode from '../components/QrCode';
import { useHouseManager, Key, Receipt } from '../context/db';
import { formatAddress } from '../utils/key';
import QrCodeScanner from '../components/QrCodeScanner';
// const AWS = require('aws-sdk');
import { s3 } from '../context/filebase';
const tweetnacl = require('tweetnacl');
tweetnacl.util = require('tweetnacl-util');

function Send() {
    const { db, keyPair } = useHouseManager();
    const { nonce, toPublicKey } = useParams()
    const [uploadReceipts, setUploadReceipts] = useState<boolean>(true);
    const [uploadImages, setUploadImages] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);

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
                    userAddress: r.userAddress
                }
            } else if (!uploadReceipts && uploadImages) {
                return {
                    hash: r.hash,
                    userAddress: r.userAddress,
                    imageBuffer: r.imageBuffer,
                    imageName: r.imageName,
                    imageType: r.imageType
                }
            } else {
                return {
                    amount: r.amount,
                    date: r.date,
                    category: r.category,
                    hash: r.hash,
                    userAddress: r.userAddress,
                    imageBuffer: r.imageBuffer,
                    imageName: r.imageName,
                    imageType: r.imageType
                }
            }
            });
        try {
            setLoading(true);
            const encryptedReceipts = tweetnacl.box(
                tweetnacl.util.decodeUTF8(JSON.stringify(targetReceipts)),
                nonce,
                toPublicKey,
                keyPair.secretKey
            );

            const params = {
                Bucket: 'kakeibo-skynet',
                Key: accounts[0],
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
                    publicKey={toPublicKey}
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
