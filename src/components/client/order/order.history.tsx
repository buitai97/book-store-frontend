import { getOrderHistoryAPI } from "@/services/api";
import { convertDateToStringUS } from "@/services/helper";
import { ProColumns, ProTable, ProTableProps } from "@ant-design/pro-components";
import { useEffect, useState } from "react";

interface IHistoryTable {
    id: string;
    date: Date;
    total: number;
    status: string;
}

const OrderHistoryPage = () => {
    const columns: ProColumns<IHistoryTable>[] = [
        {
            title: "Order ID",
            dataIndex: 'id',
            key: "id"
        },
        {
            title: "Date",
            dataIndex: 'date',
            key: 'date',
            render(dom, entity, index, action, schema) {
                return (convertDateToStringUS(entity.date))
            },
        },
        {
            title: "Total",
            dataIndex: 'total',
            key: "total"
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: "status"
        },
        {
            title: "Detail",
            dataIndex: 'detail',
            key: "detail",
            render(dom, entity, index, action, schema) {
                return (<a>Show Details</a>)
            },
        },
    ]

    const [orderList, setOrderList] = useState<IHistoryTable[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await getOrderHistoryAPI()
            if (res) {
                setOrderList(res.data.map((item: any) => {

                    return {
                        id: item._id,
                        date: item.updatedAt,
                        total: item.totalPrice,
                        status: item.paymentStatus
                    }
                }))
            }
        }
        fetchData()
    }, [])

    return (
        <ProTable dataSource={orderList} columns={columns} />
    )
}

export default OrderHistoryPage