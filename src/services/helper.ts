import dayjs from "dayjs"

export const FORMAT_DATE = "YYYY-MM-DD"
export const FORMAT_DATE_US = "MM-DD-YYYY"

export const dateRangeValidate = (dateRange: any) => {
    if (!dateRange) return undefined

    const startDate = dayjs(dateRange[0], FORMAT_DATE).toDate()
    const endDate = dayjs(dateRange[1], FORMAT_DATE).toDate()

    return [startDate, endDate]
}

export const convertDateToStringUS = (date: Date | undefined) => {
    return dayjs(date).format(FORMAT_DATE_US)
}

export const convertNumberToVND = (money: number) => {
    let VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money)
}