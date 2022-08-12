import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import {Html5QrcodeScanner} from "html5-qrcode"
import { fromBase64, toBase64 } from '../utils/key';


type IQrCodeProps = {
    nonce: Uint8Array;
    setNonce: (nonce: Uint8Array) => void;
    publicKey: Uint8Array;
    setPublicKey: (publicKey: Uint8Array) => void;

}


function QrCodeScanner({ nonce, setNonce, publicKey, setPublicKey }: IQrCodeProps) {
    const [created, setCreated] = useState<boolean>(false);
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
                        value={toBase64(publicKey)}
                        onChange={(e) => setPublicKey(fromBase64(e.target.value))} />
                    <label htmlFor="in">Destination address</label>
                </span>
            </div>
            <div className="col-12 md:col-12">
                <span className="p-float-label">
                    <InputText
                        value={toBase64(nonce)}
                        onChange={(e) => setNonce(fromBase64(e.target.value))} />
                    <label htmlFor="in">Nonce</label>
                </span>
            </div>
        </>
    );
}

export default QrCodeScanner;
