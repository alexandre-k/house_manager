import React, { useEffect, useState } from 'react';
// import { useAuth } from '@altrx/gundb-react-auth';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import Receipts from '../components/Receipts';
import NewReceipt from '../components/NewReceipt';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import './Day.css';


type Props = {
    date: number;
}

function Day({ date }: Props) {
    const navigate = useNavigate();
    const [isAddingReceipt, setIsAddingReceipt] = useState(false);
    const day = dayjs.unix(date);

    const onAddReceipt = () => {
        console.log('Add receipt')
        setIsAddingReceipt(!isAddingReceipt);
    }
    const header = () => {
        return <>
            <div className="p-m-4" id="header">
                <Button
                    icon="pi pi-angle-left"
                    className="p-button-rounded p-button-outlined"
                    onClick={() => isAddingReceipt ? setIsAddingReceipt(false) : navigate('/calendar') } />
                <h3 className="p-m-3">
                    { day.format('DD/MM/YYYY')}
                </h3>

                <Button icon={isAddingReceipt ? 'pi pi-minus' : 'pi pi-plus'} className="p-button-rounded p-button-outlined" onClick={onAddReceipt} />
            </div>
        </>
    }

    return (
        <Card className="p-shadow-24" header={header}>
            {!isAddingReceipt?
             <Receipts date={date} isAddingReceipt={isAddingReceipt} />:
            <NewReceipt date={date} setIsAddingReceipt={setIsAddingReceipt} />}
        </Card>
    );
}


export default Day;
