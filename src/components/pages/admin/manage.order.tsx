import { getAllOrdersAPI } from "@/services/api";
import { ProColumns, ProTable, ProTableProps } from "@ant-design/pro-components";
import { useEffect, useState } from "react";




const ManageOrderPage = () => {
    const [dataSource, setDataSource] = useState<IOrderTable[]>()

    useEffect(() => {
        const getOrderData = async () => {
            const res = await getAllOrdersAPI()
            if (res && res.data) {
                setDataSource(res.data.result)
            }
            else {
                console.log(res.message)
            }
        }
        getOrderData()
    }, [])

    const columns: ProColumns<IOrderTable>[] = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            hideInSearch: true
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: 'Date',
            dataIndex: 'updatedAt',
            key: 'updated At',
            valueType: 'date'
        },
    ];
    return (
        <ProTable<IOrderTable> dataSource={dataSource} columns={columns} />
    )
}

export default ManageOrderPage;
