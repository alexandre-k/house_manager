// export const categories = ['食費', '遊び', '家賃', '光熱水費', '通信費', '日用品', '外食費'];
export const expenditureTypes: Array<string> = ['food', 'entertainment', 'rent', 'electricity', 'communication', 'dailyNecessities', 'eatOutside']

export const expenditureColors: Array<string> = [
    '#FFADAD',
    '#FFD6A5',
    '#FDFFB6',
    '#CAFFBF',
    '#9BF6FF',
    '#A0C4FF',
    '#FFC6FF'
]

export const categoryColors: Record<string, string> = expenditureTypes.reduce((cc, cat, i) => ({ ...cc, [cat]: expenditureColors[i] }), {})

export const expenditureHoverColors: Array<string> = [
    '#FFC9C9',
    '#FEE1C0',
    '#FDFED2',
    '#CAFFBF',
    '#D7FDD0',
    '#BED7FE',
    '#FEDCFE'
]

export const categoryHoverColors: Record<string, string> = expenditureTypes.reduce((cc, cat, i) => ({ ...cc, [cat]: expenditureHoverColors[i] }), {})
// export const expenditureTypesTranslated: Record<string, string> = expenditureTypes.reduce((o, t) => ({...o, [t]: i18n.t("receipt." + t) }), {});
// const obj = yourArray.reduce((o, key) => Object.assign(o, {[key]: whatever}), {});
