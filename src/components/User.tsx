import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Navigate,
    Routes,
    Route,
    useLocation,
    useNavigate
} from "react-router-dom";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { ProgressBar } from 'primereact/progressbar';
import { db } from '../context/db';
// import ECIES from 'bitcore-ecies';
// const bitcoin = require('bitcoinjs-lib');
// import bip39 from 'bip39';
// import bip32 from 'bip32';
// console.log(Bitcoin)
// console.log('BITCOIN ', bitcoin.ECKey.makeRandom())
// console.log('bip39 ', bip39)
import crypto from 'crypto';
import * as secp256k1 from '@transmute/did-key-secp256k1';

console.log('secp256k1 ', secp256k1)


type IUserProps = {
    isLoggedIn: boolean,
    setIsLoggedIn: (isLoggedIn: boolean) => void
    showConnectDialog: boolean
    setShowConnectDialog: (showConnectDialog: boolean) => void
}

type FormData = {
    username: string;
    password: string;
    confirmPassword: string;
};

function User({ isLoggedIn, setIsLoggedIn, showConnectDialog, setShowConnectDialog }: IUserProps) {

    const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [displayBasic, setDisplayBasic] = useState(false);
    // const [formData, setFormData] = useState({});
    // const network = bitcoin.networks.bitcoin;
    // console.log('network + ')
    // console.log(network)

    useEffect(() => {
        const getUsers = async () => {
            const currentUsers = await db.users.toArray();
            console.log('Current users ', currentUsers)
            // create default
            if (currentUsers.length === 0) {
                // const me = ECIES().privateKey(aliceKey).publicKey()
                // console.log('me ', me)
                // const HDPrivateKey = bitcore.HDPrivateKey;
                // console.log('HD PRIVATE KEY ', HDPrivateKey)
            }
        }
        getUsers();

    })

    /* const items = [
     *     {
     *         label: 'Users',
     *         icon: 'pi pi-fw pi-user'
     *     },
     *     {
     *         label: 'Quit',
     *         icon: 'pi pi-fw pi-power-off'
     *     }
     * ]
     */
     const end = {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off'
    }

    const onHide = () => {
        setShowConnectDialog(false);
    }

    const disconnect = () => {
        console.log('Disconnect');
        /* user.leave(function(ack) {
         *     console.log('Leaved: ', ack);
         * }); */
    }
    const connect = () => {
        setShowConnectDialog(true);
    }

    const walletButton = <Button icon="pi pi-wallet" className="p-button-primary mt-0" onClick={disconnect} />;

    const connectButton = <Button label="Connect" className="p-button-primary mt-0" onClick={connect} />;

   const rightContents = isLoggedIn? walletButton : connectButton;

    const toolBarStyle = { width: '100%', height: '55px' };
    const onSubmit = (data: FormData) => {
        // setFormData(data);
        console.log('formData: ', data)
        /* gun.get('profile').get('me').once(found => {
         *     console.log('profile search result > ', found)
         *     if (found) {
         *         user.auth(formData.name, formData.password, function (at) {
         *             if (at.err) {
         *                 console.log('Error: ', at.err);
         *             } else {
         *                 console.log('Success auth: ', at.ack)
         *                 onHide();
         *             }
         *         })
         *     } else {
         *         user.create(formData.name, formData.password, function (ack) {
         *             console.log('ack > ', ack)
         *             gun
         *                    .get('profiles')
         *                    .get('me')
         *                    .put({
         *                        name: formData.name,
         *                        pub: ack.pub,
         *                        identity: 'gundb' })
         *             user.auth(formData.name, formData.password, function (at) {
         *                 if (at.err) {
         *                     console.log('Error: ', at.err);
         *                 } else {
         *                     console.log('Success auth: ', at.ack)
         *                     onHide();
         *                 }
         *             })
         *         })
         *     }
         * }) */

    };
    const passwordHeader = <h6>Pick a password</h6>;
    /* const passwordFooter = (
     *     <React.Fragment>
     *         <Divider />
     *         <p className="mt-2">Suggestions</p>
     *         <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
     *             <li>At least one lowercase</li>
     *             <li>At least one uppercase</li>
     *             <li>At least one numeric</li>
     *             <li>Minimum 8 characters</li>
     *         </ul>
     *     </React.Fragment>
     * ); */

    return (
        <>
            {/* <ProgressBar mode="indeterminate" /> */}
            <Dialog
                header="Connect user"
                visible={showConnectDialog && !isLoggedIn}
                style={{ width: '50vw' }}
                onHide={() => onHide()}>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="field">
                                <label htmlFor="username" >Username*</label>
                                <InputText {...register('username')} autoFocus />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password*</label>
                                <Password {...register('password')} />
                            </div>
                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default User;
