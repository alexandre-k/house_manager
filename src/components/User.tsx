import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Navigate,
    Routes,
    Route,
    useLocation,
    useNavigate
} from "react-router-dom";
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { useHouseManager, Key } from '../context/db';
import { formatAddress } from '../utils/key';
const Account = require('web3-eth-accounts');
import { web3, ProviderRpcError } from '../context/crypto';
import EthCrypto from 'eth-crypto';
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');
const {default: Resolution} = require('@unstoppabledomains/resolution');


function User() {
    const { db } = useHouseManager();
    const [accounts, setAccounts] = useState<string[]>([]);
    const menu = useRef(null);
    const toast = useRef(null);

    const generateKeyPair= async () => {
        const keys = await db.keys.toArray();
        const firstKeyPair = keys[0];
        // create default
        if (!firstKeyPair) {
            const keyPair = nacl.box.keyPair();
            const nonce = nacl.randomBytes(16);
            const encryptionKeys = {
                publicKey: keyPair.publicKey,
                secretKey: keyPair.secretkey,
                nonce,
                accounts: []
            }
            await db.keys.add(encryptionKeys);
        }
    }

    const lookupAddress = async (address: string) => {
        console.log('lookup > ', address)

        /* resolution
         *        .addr(addr, currency)
         *        .then((address: string) => console.log(domain, 'resolves to', address))
         *        .catch(console.error); */
    }

    const displayAccount = async () => {
        if (!web3) return;
        const retrievedAccounts = await web3.eth.getAccounts();
        if (retrievedAccounts.length === 0) return;
        setAccounts(retrievedAccounts);
        const keys = await db.keys.toArray();
        const firstKeyPair = keys[0];
        if (firstKeyPair) {
            firstKeyPair.accounts = retrievedAccounts;
            await db.keys.put(firstKeyPair, [firstKeyPair.publicKey])
        }

        const resolution = new Resolution();
        const domain = retrievedAccounts[0];
        const currency = 'ETH'
        const name = 'alex-ze-pequenh0.crypto'
        const addr = '0xD984cF2F549bB329B2712E13Ab8e3291f4dCBC75'
        lookupAddress(addr);
    }

    useEffect(() => {
        generateKeyPair();
        displayAccount();
    }, [web3])

    const items = [
        {
            label: 'Copy address',
            icon: 'pi pi-fw pi-copy',
            command: async () => {
                const keys = await db.keys.toArray();
                const firstKeyPair = keys[0];
                if (!firstKeyPair) {
                    alert('Unable to copy key pair');
                    return;
                }

                const publicKey = nacl.util.encodeUTF8(firstKeyPair.publicKey);
                navigator.clipboard.writeText(publicKey);
                if (toast.current === null) return
                // @ts-ignore
                toast.current.show({
                    severity: 'success',
                    summary: 'Copied',
                    detail: 'Address copied',
                    life: 3000
                });
            }
        },
        {
            label: 'Disconnect',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                if (toast.current === null) return
                // @ts-ignore
                toast.current.show({
                    severity: 'success',
                    summary: 'Updated',
                    detail: 'Data Updated',
                    life: 3000
                });
            }
        }
    ]

    const disconnect = () => {
        /* user.leave(function(ack) {
         *     console.log('Leaved: ', ack);
         * }); */
    }
    const connect = async () => {
        // setShowConnectDialog(true);
        try {
            const requestedAccounts = await web3.eth.requestAccounts();
            console.log('req > ', requestedAccounts);
            displayAccount()
        } catch (err: any) {
            if (err.code === 4001) {
                alert(err.message);
            }
        }
    }

    const walletButton = <Button icon="pi pi-wallet" iconPos="left" className="p-button-primary mt-0" onClick={disconnect} />;

    const connectButton = () => {
        return (<Button label="Connect" className="p-button-primary mt-0" onClick={connect} />)
    }

    const connectedButton = () => {
        return (
            <>
                <Button
                    className="mt-0 p-button-primary p-button-success p-button-outlined"
                    icon="pi pi-wallet"
                    iconPos="left"
                    label={formatAddress(accounts)}
                     //@ts-ignore
                    onClick={(event) => menu.current ? menu.current.toggle(event) : null}
                    aria-controls="popup_menu"
                    aria-haspopup
                />
                <Menu model={items} popup ref={menu} />
            </>
        )
    };

    const rightContents = accounts.length > 0 ? connectedButton() : connectButton();
    const toolBarStyle = { width: '100%', height: '55px' };

    return (
        <>
            {rightContents}
            <Toast ref={toast} />
        </>
    );
}

export default User;
