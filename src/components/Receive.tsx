import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import QrCode from '../components/QrCode';
import { useHouseManager, Key } from '../context/db';
import { formatAddress } from '../utils/key';
const Account = require('web3-eth-accounts');
const AWS = require('aws-sdk');
import { web3 } from '../context/crypto';
import EthCrypto from 'eth-crypto';
const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');
const tweetnacl = require('tweetnacl'); 
tweetnacl.util = require('tweetnacl-util');


function Receive() {
    const { db } = useHouseManager();
    const [fromPublicKey, setFromPublicKey] = useState<string>('');
    const [accounts, setAccounts] = useState<string[]>([]);
    const getProviderAddress = async () => {
        try {
            const retrievedAccounts = await web3.eth.getAccounts();
            setAccounts(retrievedAccounts);
        } catch (error) {
            console.log('[New Receipts] getAccounts: ', error)
        }
    }

    useEffect(() => {
        getProviderAddress();
    }, []);

    const downloadData = async () => {
        const params = {
            Bucket: 'kakeibo-skynet',
            Key: fromPublicKey
        };
        // @ts-ignore
        const request = s3.getObject(params, async (err, data) => {
            if (err) alert(err)
            const keyPairs = await db.keys.toArray();
            // create default
            if (keyPairs.length === 0) {
                alert('No key created')
                return;
            }
            const keyPair = keyPairs[0];
            const body = data.Body;
            // decrypt the encrypted message

            const decryptedBody = tweetnacl.box.open(
                body,
                keyPair.nonce,
                fromPublicKey,
                keyPair.secretKey
            );

            const receipts = JSON.parse(tweetnacl.util.encodeUTF8(decryptedBody));
            try {
                const receiptId = await db.receipts.bulkAdd(receipts);
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
                <QrCode accounts={accounts} />
            </div>
        </>
    )
}

export default Receive;
