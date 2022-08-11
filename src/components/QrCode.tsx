import React, { useEffect, useRef, useState } from 'react';
const Account = require('web3-eth-accounts');
import { Button } from 'primereact/button';
import EthCrypto from 'eth-crypto';
import QRCodeStyling from 'qr-code-styling';
import { web3 } from '../context/crypto';
import { Key } from '../context/db';
import { useHouseManager } from '../context/db';
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

type IQrCodeProps = {
    accounts: string[];
}


function QrCode({ accounts }: IQrCodeProps) {
    const { db } = useHouseManager();
    const [publicKey, setPublicKey] = useState<string>('');
    const [created, setCreated] = useState<boolean>(false);
    const canvas = useRef<HTMLElement|null>(document.getElementById('publicKey'));

    const generateUrl = async () => {
        const keys = await db.keys.toArray();
        const keyPair = keys[0];
        if (!keyPair) {
            alert('Bad key pair, not found');
            throw('Bad key pair, not found');
        }
        const nonce = nacl.util.encodeBase64(keyPair.nonce);
        const publicKey = nacl.util.encodeBase64(keyPair.publicKey);
        const url = location.href + '/receive/' + nonce + '/' + publicKey
        return url
    }

    const onCopy = async () => {
        try {
            const url = await generateUrl();
            navigator.clipboard.writeText(url);
        } catch (err) {
            alert(err);
        }
    }

    const makeQrCode = async () => {
        if (!accounts || !canvas || created) return;
        try {
            const url = await generateUrl();
            setCreated(true);
            const qrCode = new QRCodeStyling({
                width: 300,
                height: 300,
                data: url,
                image: '/images/icon.jpg',
                dotsOptions: {
                    color: "#4267b2",
                    type: "rounded"
                },
                backgroundOptions: {
                    color: "#e9ebee",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 20
                }
            });
            qrCode.append(canvas.current as HTMLElement);
        } catch (error) {
            // @ts-ignore
            if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                alert("We can't encrypt anything without the key.");
            } else {
                alert(error);
            }

        }
    }

    useEffect(() => {
        canvas.current = document.getElementById('publicKey')
        makeQrCode();
    }, [])

    return (
        <>
            <div
                className="flex align-content-center justify-content-center"
                id="publicKey"
            >
            </div>

            <Button label="share download url" icon="pi pi-copy" onClick={onCopy} />
        </>
    );
}

export default QrCode;
