import React, { useEffect, useRef, useState } from 'react';
const Account = require('web3-eth-accounts');
import { InputText } from 'primereact/inputtext';
import {Html5QrcodeScanner} from "html5-qrcode"


type IQrCodeProps = {
    nonce: string | undefined;
    publicKey: string | undefined;

}


function QrCodeScanner({ nonce, publicKey }: IQrCodeProps) {
    const [created, setCreated] = useState<boolean>(false);
    const [userPublicKey, setUserPublicKey] = useState<string>(publicKey ? publicKey : '');
    const [userNonce, setUserNonce] = useState<string>(nonce ? nonce : '');
    const canvas = useRef<HTMLElement|null>(document.getElementById('publicKey'));

    // @ts-ignore
    function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);
    }

    // @ts-ignore
    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
    }

    /* useEffect( () => {
     *     let html5QrcodeScanner = new Html5QrcodeScanner(
     *         "reader",
     *         { fps: 10, qrbox: {width: 250, height: 250} },
     *         verbose= false);
    *     html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    * }); */
    return (
        <>
            <div className="col-12 md:col-12">
            {/* <div id="reader" style={{ width: "600px" }}></div> */}
            {/* <input type="file" id="qr-input-file" accept="image/*" /> */}
                <span className="p-float-label">
                    <InputText
                        value={userPublicKey}
                        onChange={(e) => setUserPublicKey(e.target.value)} />
                    <label htmlFor="in">Destination address</label>
                </span>
            </div>
            <div className="col-12 md:col-12">
                <span className="p-float-label">
                    <InputText
                        value={userNonce}
                        onChange={(e) => setUserNonce(e.target.value)} />
                    <label htmlFor="in">Nonce</label>
                </span>
            </div>
        </>
    );
}

export default QrCodeScanner;