import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Calendar } from 'primereact/calendar';
import { createClient } from '@supabase/supabase-js';
import './Calendar.css';
import { arrayToHex, getHash, getSignature } from '../utils/key';
import { dateToUnix, getBeginningMonthDate, getEndMonthDate, getDay, getMonth, unixToDate } from '../utils/date';
import { useHouseManager, Receipt } from '../context/db';

type CalendarDate = {
    day: number;
    month: number;
    year: number;
    today: boolean;
    selectable: boolean;
}

function InAppCalendar() {
    const { db, date, setDate, keyPair } = useHouseManager();
    const navigate = useNavigate();
    const today = unixToDate(date);
    const [monthReceipts, setMonthReceipts] = useState(0);
    const [receipts, setReceipts] = useState<Record<string, Receipt[]>>({});
    const [receiptsByDate, setReceiptsByDate] = useState<Record<string, Receipt[]>>({});
    const [viewDate, setViewDate] = useState(new Date(today));
    const allReceipts = async () => {
        const found = await db
            .receipts
            .where('date')
            .between(
                getBeginningMonthDate(dateToUnix(viewDate)),
                getEndMonthDate(dateToUnix(viewDate))
            )
            .toArray();
        setMonthReceipts(found.length)

        // Initialize the JS client
        const supabase = createClient(process.env.REACT_APP_SUPABASE_URL || "", process.env.REACT_APP_SUPABASE_API_KEY || "")
        let { data: receipts } = await supabase
            .from('receipts')
            .select('*')
        if (keyPair) {
            const receipts_to_db = found.map((receipt: Receipt) => {
                const receiptHash = getHash(receipt);
                return {
                    "amount": receipt.amount,
                    "category": receipt.category,
                    "date": receipt.date,
                    "hash": arrayToHex(receiptHash),
                    "public_key": arrayToHex(keyPair.publicKey),
                    "ownership_proof": ""
                }
            })
        const { data, error } = await supabase
            .from('receipts')
            .insert(receipts_to_db)
        }

        // Make a request
        if (!found) return []
        const receiptsByDay: Record<string, Receipt[]> = {};
        found.forEach((receipt: Receipt) => {
            const day = getDay(receipt.date);
            if (!receiptsByDay[day]) receiptsByDay[day] = [];
            // @ts-ignore
            receiptsByDay[day].push(receipt);
        });
        setReceipts(receiptsByDay);
    }
    useEffect(() => {
        allReceipts()
    }, [viewDate])

    const dateTemplate = (d: CalendarDate) => {
        if (receipts[d.day] !== undefined && getMonth(date) === d.month) {
            return (
                        <span className="p-overlay-badge">
                            <span  style={{ zIndex: 10000, color: 'black' }}>
                                {d.day}
                            </span>
                            <Badge
                                value={receipts[d.day].length} style={{ fontSize: '10px', width: '6px', height: '17px', marginTop: '-4px' }} className="mr-3"></Badge>
                        </span>
            )
        } else {
            return (
                <span>{d.day}</span>)
        }
    }
    return (
        <Card className="p-shadow-24" id="calendar" subTitle={monthReceipts + ' receipts found'}>
            <div className="p-fluid grid formgrid">
                <div className="col-12">
                    <Calendar
                        inline
                        viewDate={viewDate}
                        value={today}
                        dateTemplate={dateTemplate}
                        onViewDateChange={(e) => {
                            setViewDate(e.value)
                            setDate(dateToUnix(e.value))
                        }}
                        onSelect={
                        (e) => {
                            // @ts-ignore
                            setDate(dateToUnix(e.value));
                            navigate('day');
                        } } />
                </div>
            </div>
        </Card>
    );
}

export default InAppCalendar;
