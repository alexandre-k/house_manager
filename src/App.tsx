import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Toolbar } from 'primereact/toolbar';
import { TabMenu } from 'primereact/tabmenu';
import { useContext } from 'react';
import { KeyPair, HouseManager, Receipt, HouseManagerContext } from './context/db';
import './App.css';
import Dashboard from './views/Dashboard';
import Day from './views/Day';
import InAppCalendar from './views/Calendar';
import { getUnixTimestamp } from './utils/date';
import Share from './components/Share';
import User from './components/User';
import { generateKeyPair } from './utils/key';
// import { Account } from 'web3-core'
// import { ethers, providers } from 'ethers';
// import Web3Moal from 'web3modal';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import WalletLink from 'walletlink';

type NavigationItem = {
    route: string,
    command: () => void,
    icon: string
}

function App() {
    const db = new HouseManager();
    const [showConnectDialog, setShowConnectDialog] = useState(false);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [keyPair, setKeyPair] = useState<KeyPair>(null as any);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!keyPair)
            generateKeyPair(db).then(keyPair => setKeyPair(keyPair));
    })

    const navigationRoutes: Array<NavigationItem> = [
        { route: '/calendar', command: () => navigate('/calendar'), icon: 'pi pi-fw pi-calendar' },
        { route: '/dashboard', command: () => navigate('/dashboard'), icon: 'pi pi-fw pi-chart-pie' },
        { route: '/share', command: () => navigate('/share'), icon: 'pi pi-fw pi-share-alt' }
    ];

    const index = navigationRoutes.findIndex(
        item => item.route === location.pathname)
    const [activeIndex, setActiveIndex] = useState(index === -1 ? 0 : index);

     const end = {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off'
    }

    const [date, setDate] = useState<number>(getUnixTimestamp());

    const onHide = () => {
        setShowConnectDialog(false);
    }

    const disconnect = () => {
        console.log('Disconnect');
    }
    const connect = () => {
        setShowConnectDialog(true);
    }

    const walletButton = <Button icon="pi pi-wallet" className="p-button-primary mt-0" onClick={disconnect} />;

    const connectButton = <Button label="Connect" className="p-button-primary mt-0" onClick={connect} />;

    const user = <User />
    const toolBarStyle = { width: '100%', height: '55px' };

    const routes = [
        { path: "/share", element: <Share /> },
        { path: "/share/receive/:nonce/:toPublicKey", element: <Share /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/calendar", element: <InAppCalendar /> },
        { path: "/calendar/day", element: <Day date={date} /> },
        { path: "/calendar", element: <InAppCalendar /> },
    ]

        return (
            <HouseManagerContext.Provider value={{ db, keyPair, date, setDate }}>
            <Toolbar
                className="pt-1"
                style={toolBarStyle}
                right={user}
            />
            <div className="flex align-items-center" id="content">
                <Routes>
            {routes.map((route, idx) => <Route key={idx} path={route.path} element={route.element}/>)}
                    <Route
                        path="*"
                        element={<Navigate to="/calendar" replace />} />
                </Routes>
            </div>
            <TabMenu
                id="tabMenu"
                model={navigationRoutes}
                activeIndex={activeIndex}
                onTabChange={(e => setActiveIndex(e.index) )}
            />
            </HouseManagerContext.Provider>
    );
}

export default App;
