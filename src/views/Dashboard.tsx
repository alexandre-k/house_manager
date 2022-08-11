import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { useHouseManager, Receipt } from '../context/db';
import { categoryColors, categoryHoverColors } from '../utils/categories';
import { getBeginningMonthDate, getEndMonthDate, formatMonth } from '../utils/date';
import './Calendar.css';
const accounting = require("accounting");

function Dashboard() {
    const { db, date, setDate } = useHouseManager();
    const navigate = useNavigate();
    const [labels, setLabels] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);
    const [backgroundColor, setBackgroundColor] = useState<string[]>([])
    const [hoverBackgroundColor, setHoverBackgroundColor] = useState<string[]>([])
    const [total, setTotal] = useState<number>(0);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (date) {
            const allReceipts = async () => {
                const receipts = await db
                    .receipts
                    .where('date')
                    .between(
                        getBeginningMonthDate(date),
                        getEndMonthDate(date)
                    )
                    .toArray();
                if (!receipts) return [];
                setExpenditureByCategory(receipts)

            }
            allReceipts()
        }
    }, [date])
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
        <Card className="p-shadow-24" title={formatMonth(t, date)}>
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
                {accounting.formatMoney(total, { symbol: '¥' })}
            </div>
        </Card>
    );
}

export default Dashboard;
