import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Calendar } from 'primereact/calendar';
import './Calendar.css';
import { arrayToHex, getHash, getSignature } from '../utils/key';
import { dateToUnix, getBeginningMonthDate, getEndMonthDate, getDay, getMonth, unixToDate } from '../utils/date';
import { useHouseManager, Receipt } from '../context/db';
import { useQuery } from '@tanstack/react-query';



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
    const [viewDate, setViewDate] = useState(new Date(today));

    const minDate = getBeginningMonthDate(dateToUnix(viewDate));
    const maxDate = getEndMonthDate(dateToUnix(viewDate));

    const { isLoading, error, data } = useQuery({
        queryKey: ['receipts', {
            minDate: minDate.toString(),
            maxDate: maxDate.toString()
        }],
        queryFn: () =>
            fetch('/api/receipts?' + new URLSearchParams({
                minDate: minDate.toString(), maxDate: maxDate.toString()
                }).toString()).then(async res => {
                    const { data } = await res.json()
                    setMonthReceipts(data.length)

                    // Make a request
                    if (!data) return
                    const receiptsByDay: Record<string, Receipt[]> = {};
                    data.forEach((receipt: Receipt) => {
                        const day = getDay(receipt.date);
                        if (!receiptsByDay[day]) receiptsByDay[day] = [];
                        // @ts-ignore
                        receiptsByDay[day].push(receipt);
                    });
                    setReceipts(receiptsByDay);
                    return data
            })
    });


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
        }

    }
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
