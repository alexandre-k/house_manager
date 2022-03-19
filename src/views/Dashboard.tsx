import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { db, Receipt } from '../context/db';
import { categoryColors, categoryHoverColors } from '../utils/categories';
import './Calendar.css';
import dayjs from 'dayjs'

type IDashboardProps = {
    setDate: (date: number) => void
    date: number
}

function Dashboard({ setDate, date }: IDashboardProps) {
    const navigate = useNavigate();
    const [labels, setLabels] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);
    const [backgroundColor, setBackgroundColor] = useState<string[]>([])
    const [hoverBackgroundColor, setHoverBackgroundColor] = useState<string[]>([])
    const [total, setTotal] = useState<number>(0);
    const today = dayjs().unix();
    // if (!date) setDate(today);
    // date = today
    useEffect(() => {
        const allReceipts = async () => {
            // if (!date) return []
            const receipts = await db
                .receipts
                .where('date')
                .between(
                    dayjs.unix(today).startOf('month').unix(),
                    dayjs.unix(today).endOf('month').unix()
                )
                // .where({ date })
                .toArray();
            if (!receipts) return []
            console.log('receipts: ', receipts)
            setExpenditureByCategory(receipts)

        }
        allReceipts()
    }, [])
    const setExpenditureByCategory = (receipts: Receipt[]) => {
        const categories: string[] = []
        const amountsPerCategory: Record<string, number> = {}
        var tempTotal = 0;
        for (const receipt of receipts) {
            const category: string = receipt.category
            if (!categories.includes(category)) categories.push(category)
            if (!(receipt.category in amountsPerCategory)) { amountsPerCategory[category] = 0 }
            amountsPerCategory[receipt.category] += receipt.amount
            tempTotal += receipt.amount
        }
        setTotal(tempTotal);
        setBackgroundColor(categories.map(category => {
            console.log('categoryColors > ', categoryColors[category])
            return categoryColors[category]
        }));
        setHoverBackgroundColor(categories.map(category => categoryHoverColors[category]));
        const tempLabels = Object.keys(amountsPerCategory)
        setLabels(Object.keys(amountsPerCategory));
        setData(tempLabels.map(label => amountsPerCategory[label]))
    }
        /* datasets: [
         *     {
         *         data: [],
         *         backgroundColor: [
         *         ],
         *         hoverBackgroundColor: [
         *         ]
         *     }
         * ] */
    const lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    };

    return (
        <Card className="p-shadow-24" id="calendar">
            <div className="flex justify-content-center">
                <Chart
                    type="pie"
                    data={{
                        labels,
                        datasets: [{
                            data,
                            backgroundColor,
                            hoverBackgroundColor
                        }]
                    }}
                    options={lightOptions}
                    style={{ position: 'relative', width: '100%' }}
                />
            </div>
            <div>
                {total}
            </div>
        </Card>
    );
}

export default Dashboard;
