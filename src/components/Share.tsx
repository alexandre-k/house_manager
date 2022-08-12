import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import QrCode from '../components/QrCode';
import QrCodeScanner from '../components/QrCodeScanner';
import Receive from '../components/Receive';
import Send from '../components/Send';
import { useHouseManager } from '../context/db';
import { formatAddress, generateNonce } from '../utils/key';


function Share() {
    const { db, keyPair } = useHouseManager();
    const [publicKey, setPublicKey] = useState<Uint8Array>(null as any);
    const [nonce, setNonce] = useState<Uint8Array>(generateNonce());
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        if (!!keyPair)
            setPublicKey(keyPair.publicKey)
    }, [keyPair])
    return (
        <Card className="p-shadow-24" title="領収書の共有">
            <div
                className="card flex align-items-center justify-content-center flex-wrap card-container blue-container">
                <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="受ける">
                        <Receive nonce={nonce} />
                    </TabPanel>
                    <TabPanel header="送る">
                        <Send publicKey={publicKey} nonce={nonce} setPublicKey={setPublicKey} setNonce={setNonce} />
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}

export default Share;
