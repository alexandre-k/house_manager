import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import QRCodeStyling from 'qr-code-styling';
import { Key, KeyPair } from '../context/db';
import { serializeNoncePubKey } from '../utils/key';

type IQrCodeProps = {
    publicKey: string;
}


function QrCode({ publicKey }: IQrCodeProps) {
    const [created, setCreated] = useState<boolean>(false);
    const canvas = useRef<HTMLElement|null>(document.getElementById('publicKey'));

    const onCopy = async (copiedText: string) => {
        try {
            // const url = await generateUrl();
            // console.log(url)
            navigator.clipboard.writeText(copiedText);
        } catch (err) {
            alert(err);
        }
    }

    const makeQrCode = async () => {
        if (!publicKey || !canvas || created) return;
        try {
            setCreated(true);
            const qrCode = new QRCodeStyling({
                width: 300,
                height: 300,
                data: publicKey,
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
                style={{ maxWidth: '220px' }}
            >
            </div>

            <div className="flex flex-grow-1 flex-column justify-content-around" style={{ minHeight: '170px'}}>
            <Button label="share public key" icon="pi pi-copy" onClick={() => onCopy(publicKey)} />

            </div>
        </>
    );
}

export default QrCode;
