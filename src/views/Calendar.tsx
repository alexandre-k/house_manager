import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Calendar } from 'primereact/calendar';
import './Calendar.css';
import { db, Receipt } from '../context/db';
import dayjs from 'dayjs'

type ICalendarProps = {
    setDate: (date: number) => void
    date: number
}

type CalendarDate = {
    day: number
}

function InAppCalendar({ date, setDate }: ICalendarProps) {
    const navigate = useNavigate();
    const today = dayjs.unix(date).toDate();
    const [receipts, setReceipts] = useState<Record<string, Receipt[]>>({});
    const [receiptsByDate, setReceiptsByDate] = useState<Record<string, Receipt[]>>({});
    useEffect(() => {
        const allReceipts = async () => {
            // if (!date) return []
            const found = await db
                .receipts
                .where('date')
                .between(
                    dayjs.unix(date).startOf('month').unix(),
                    dayjs.unix(date).endOf('month').unix()
                )
            // .where({ date })
                .toArray();
            if (!receipts) return []
            console.log('found: ', found)
            const receiptsByDay: Record<string, Receipt[]> = {};
            found.forEach(receipt => {
                const day = dayjs.unix(receipt.date).date();
                if (!receiptsByDay[day]) receiptsByDay[day] = [];
                receiptsByDay[day].push(receipt);
            });
            setReceipts(receiptsByDay);
        }
        allReceipts()
    }, [])

    const dateTemplate = (d: CalendarDate) => {
        if (receipts[d.day] !== undefined) {
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
        <Card className="p-shadow-24" id="calendar">
            <div className="p-fluid grid formgrid">
                <div className="col-12">
                    <Calendar
                        inline
                        value={today}
                        dateTemplate={dateTemplate}
                        onSelect={
                        (e) => {
                            const value = e.value.toString();
                            setDate(dayjs(value).unix());
                            navigate('day');
                        } } />
                </div>
            </div>
        </Card>
    );
}

export default InAppCalendar;
