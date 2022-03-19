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
import './App.css';
import Dashboard from './views/Dashboard';
import Day from './views/Day';
import InAppCalendar from './views/Calendar';
import User from './components/User';
import dayjs from 'dayjs';

type NavigationItem = {
    route: string,
    command: () => void,
    icon: string
}

function App() {

    /* const { control, formState: { errors }, handleSubmit, reset } = useForm(
     *     {
     *         name: '',
     *         password: '',
     *         accept: false
     *     }); */
    const [showConnectDialog, setShowConnectDialog] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [displayBasic, setDisplayBasic] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    // const isLoading = true;
    // user.once(u => console.log('user > ', u))
    const navigationRoutes: Array<NavigationItem> = [
        { route: '/calendar', command: () => navigate('/calendar'), icon: 'pi pi-fw pi-calendar' },
        { route: '/dashboard', command: () => navigate('/dashboard'), icon: 'pi pi-fw pi-chart-pie' },
        /* { route: '/share', icon: 'pi pi-fw pi-share-alt' },
         * { route: '/chat', icon: 'pi pi-fw pi-discord' },
         * { route: '/settings', icon: 'pi pi-fw pi-cog' } */
    ];

    const index = navigationRoutes.findIndex(
        item => item.route === location.pathname)
    const [activeIndex, setActiveIndex] = useState(index === -1 ? 0 : index);

    /* const loading = () => {
     *     if (isLoading) {
     *         return <ProgressBar mode="indeterminate" />
     *     }
     * } */

    /* const items = [
     *     {
     *         label: 'Users',
     *         icon: 'pi pi-fw pi-user'
     *     },
     *     {
     *         label: 'Quit',
     *         icon: 'pi pi-fw pi-power-off'
     *     }
     * ] */
     const end = {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off'
    }

    console.log(dayjs().unix())
    const [date, setDate] = useState<number>(dayjs().unix());

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

    return (
        <>
            <User
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                showConnectDialog={showConnectDialog}
                setShowConnectDialog={setShowConnectDialog}
            />
            <Toolbar className="pt-1" style={toolBarStyle} right={rightContents} />
            {/* <ProgressBar mode="indeterminate" /> */}
            <div className="flex align-items-center" id="content">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard setDate={setDate} date={date} />}/>
                    <Route path="/calendar" element={<InAppCalendar date={date} setDate={setDate} />}/>
                    <Route path="/calendar/day" element={<Day date={date} />} />

                    <Route path="*" element={<Navigate to="/calendar" replace />} />
                    {/* <Route path="chart" element={<Chart />} /> */}
                </Routes>
            </div>
            <TabMenu
                id="tabMenu"
                model={navigationRoutes}
            activeIndex={activeIndex}
                onTabChange={(e => setActiveIndex(e.index) )}
            />
        </>
    );
}

export default App;
