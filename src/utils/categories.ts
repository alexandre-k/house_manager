// export const categories = ['食費', '遊び', '家賃', '光熱水費', '通信費', '日用品', '外食費'];

export const expenditureTypes: Array<string> = [
    'food',
    'entertainment',
    'rent',
    'electricity',
    'communication',
    'dailyNecessities',
    'eatOutside',
    'waterBill',
    'gasBill'
]

export const expenditureColors: Array<string> = [
    '#FFADAD', // food
    '#FFD6A5', // entertainment
    '#FDFFB6', // rent
    '#ffff00', // electricity
    '#d3d9de', // communication
    '#A0C4FF', // daily necessities
    '#ff0066', // eat outside
    '#00ffff', // water bill
    '#800080'  // gas bill
]

export const categoryColors: Record<string, string> = expenditureTypes.reduce((cc, cat, i) => ({ ...cc, [cat]: expenditureColors[i] }), {})

export const expenditureHoverColors: Array<string> = [
    '#FFC9C9', // food
    '#FEE1C0', // entertainment
    '#FDFED2', // rent
    '#ffff99', // electricity
    '#e2e6e9', // communication
    '#BED7FE', // daily necessities
    '#ff3385', // eat outside
    '#99ffff', //  water bill
    '#b300b3'  // gas bill
]

export const categoryHoverColors: Record<string, string> = expenditureTypes.reduce((cc, cat, i) => ({ ...cc, [cat]: expenditureHoverColors[i] }), {})
// export const expenditureTypesTranslated: Record<string, string> = expenditureTypes.reduce((o, t) => ({...o, [t]: i18n.t("receipt." + t) }), {});
// const obj = yourArray.reduce((o, key) => Object.assign(o, {[key]: whatever}), {});
