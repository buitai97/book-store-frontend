import { getUsersAPI } from '@/services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';

const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'ID',
        dataIndex: '_id',
        hideInSearch: true,
        render(dom, entity, index, action, schema) {
            return <a href="#">{entity._id}</a>
        },

    }, {
        title: 'Full Name',
        dataIndex: 'fullName',
    }, {
        title: 'Email',
        dataIndex: 'email',

    }, {
        title: 'Created At',
        dataIndex: 'createdAt',
        valueType: 'dateTime',
    },
    {
        title: "Action",
        key: 'action',
        render: () => (<div style={{ display: "flex", gap: 16 }}> <EditOutlined style={{ color: 'orange' }} /><DeleteOutlined style={{ color: 'red' }} /></div>)

    }

];

const TableUser = () => {
    const actionRef = useRef<ActionType>();

    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    const current = params.current || 1
                    const pageSize = params.pageSize || 5
                    const res = await getUsersAPI(current, pageSize)
                    console.log(sort, filter);
                    return {
                        // data: data.data,
                        data: res.data?.result,
                        "page": 1,
                        "success": true,
                        "total": res.data?.meta.total || 0
                    }
                }}
                rowKey="_id"
                pagination={{
                    showSizeChanger: true,
                    pageSize: 5
                }}

                headerTitle="Users"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;