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
import { formatAddress } from '../utils/key';
// const Account = require('web3-eth-accounts');
// const AWS = require('aws-sdk');
// import { web3 } from '../context/crypto';
// import EthCrypto from 'eth-crypto';
// const ethUtil = require('ethereumjs-util');
// const sigUtil = require('@metamask/eth-sig-util');
// const tweetnacl = require('tweetnacl'); 
// tweetnacl.util = require('tweetnacl-util');


function Share() {
    const { nonce, toPublicKey } = useParams()
    const [activeIndex, setActiveIndex] = useState( nonce && toPublicKey ? 1 : 0);
    /* useEffect(() => {
     *     const getProviderAddress = async () => {
     *         try {
     *             const retrievedAccounts = await web3.eth.getAccounts();
     *             setAccounts(retrievedAccounts);
     *         } catch (error) {
     *             console.log('[New Receipts] getAccounts: ', error)
     *         }
     *     }

     *     getProviderAddress();
     * }, []);

     */
    return (
        <Card className="p-shadow-24" title="領収書の共有">
            <div
                className="card flex align-items-center justify-content-center flex-wrap card-container blue-container">
                <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="受ける">
                        <Receive />
                    </TabPanel>
                    <TabPanel header="送る">
                        <Send />
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}

export default Share;
