import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { useHouseManager, Key } from '../context/db';
import { formatAddress } from '../utils/key';
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');


const User = () => {
    const { db, keyPair } = useHouseManager();
    const [account, setAccount] = useState<string>('');
    const menu = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        if (keyPair) {
            setAccount(Buffer.from(keyPair.publicKey).toString('hex'));
        }
    }, [keyPair])

    const items = [
        {
            label: 'Copy address',
            icon: 'pi pi-fw pi-copy',
            command: async () => {
                if (!keyPair) {
                    alert('Unable to copy key pair');
                    return;
                }

                const publicKey = nacl.util.encodeUTF8(keyPair.publicKey);
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

    return (
        <>
            {!!keyPair ? <>
            <Button
                className="mt-0 p-button-primary p-button-success p-button-outlined"
                icon="pi pi-wallet"
                iconPos="left"
                label={formatAddress(account)}
                onClick={(event) => {
                    // @ts-ignore
                    menu.current ? menu.current.toggle(event) : null}
                }
                aria-controls="popup_menu"
                aria-haspopup
            />
            <Menu model={items} popup ref={menu} />
            </> : <Button label="Connect" className="p-button-primary mt-0" />}
            <Toast ref={toast} />
        </>
    );
}

export default User;
