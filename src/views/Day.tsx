import React, { useEffect, useState } from 'react';
// import { useAuth } from '@altrx/gundb-react-auth';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import Receipts from '../components/Receipts';
import NewReceipt from '../components/NewReceipt';
import AddReceiptButton from '../components/AddReceiptBtn';
import { useNavigate } from 'react-router-dom';
import { displayDate, getDate, unixToDate } from '../utils/date';
import './Day.css';
import { DisplayedReceipt } from '../types/receipts'

type Props = {
    date: number;
}

function Day({ date }: Props) {
    const navigate = useNavigate();
    const [isAddingReceipt, setIsAddingReceipt] = useState(false);
    const day = unixToDate(date);
    const [receipts, setReceipts] = useState<DisplayedReceipt[]>([]);

    const header = () => (
            <div className="p-m-4" id="header">
                <Button
                    icon="pi pi-angle-left"
                    className="p-button-rounded p-button-outlined"
                    onClick={() => isAddingReceipt ? setIsAddingReceipt(false) : navigate('/calendar') } />
                <h3 className="p-m-3">
                    { displayDate(getDate(date)) }
                </h3>
                <AddReceiptButton
                    isAddingReceipt={isAddingReceipt}
                    onAddReceipt={() => setIsAddingReceipt(!isAddingReceipt)}
                />
        </div>
    )

    return (
        <Card className="p-shadow-24" header={header}>
            {!isAddingReceipt?
            <Receipts
                isAddingReceipt={isAddingReceipt}
                setIsAddingReceipt={setIsAddingReceipt}
                receipts={receipts}
                setReceipts={setReceipts}
            />:
            <NewReceipt
                date={date}
                setIsAddingReceipt={setIsAddingReceipt} />}
        </Card>
    );
}


export default Day;
