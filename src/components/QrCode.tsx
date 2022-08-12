import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import QRCodeStyling from 'qr-code-styling';
import { Key, KeyPair } from '../context/db';
import { serializeKeyPair } from '../utils/key';

type IQrCodeProps = {
    keyPair: KeyPair;
}


function QrCode({ keyPair }: IQrCodeProps) {
    const [created, setCreated] = useState<boolean>(false);
    const canvas = useRef<HTMLElement|null>(document.getElementById('publicKey'));

    const generateUrl = async () => {
        if (!keyPair) {
            alert('Bad key pair, not found');
            throw('Bad key pair, not found');
        }
        const { nonce, publicKey } = serializeKeyPair(keyPair);
        return location.href + '/receive/' + nonce + '/' + publicKey
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
        if (!keyPair || !canvas || created) return;
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
