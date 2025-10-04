import { deleteUserAPI, getAllUsersAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import AddUser from './add.user';
import UploadUsers from './upload.users';
import { CSVLink } from 'react-csv';
import EditUser from './edit.user';


type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string
}


const TableUser = () => {
    const [openViewDetailModal, setOpenViewDetailModal] = useState<boolean>(false)
    const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false)
    const [openUploadModal, setOpenUploadModal] = useState<boolean>(false)
    const [openEditModal, setOpenEditModal] = useState<boolean>(false)

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false)

    const [usersData, setUsersData] = useState<IUserTable[]>([])
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null)
    const [dataEdit, setDataEdit] = useState<IUserTable | null>(null)

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
                return (
                    <a href="#" onClick={async () => {
                        setOpenViewDetailModal(true)
                        setDataViewDetail(entity)
                    }}>{entity._id}</a>
                )
            },

        }, {
            title: 'Full Name',
            dataIndex: 'fullName',
            sorter: true
        }, {
            title: 'Email',
            dataIndex: 'email',

        }, {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
        },
        {
            title: 'Created At Range',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: "Action",
            key: 'action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditOutlined
                            style={{ color: "#f57800", cursor: "pointer", marginRight: 15 }}
                            onClick={async () => {
                                setDataEdit(entity)
                                setOpenEditModal(true)
                            }} />
                        <Popconfirm
                            title="Delete User"
                            description="Are you sure to delete this user?"
                            onConfirm={async () => {
                                setIsDeleteUser(true)
                                const res = await deleteUserAPI(entity._id)
                                if (res && res.data) {
                                    refreshTable()
                                    message.success("delete user successfully!")
                                }
                                else {
                                    notification.error({ message: "Something happened: ", description: res.message })
                                }
                            }}
                            okText="Delete"
                            okType='danger'
                            cancelText="No"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <DeleteOutlined
                                style={{ color: 'red', cursor: "pointer" }}
                            ></DeleteOutlined>
                        </Popconfirm>
                    </>
                )

            },
        }

    ];

    const actionRef = useRef<ActionType>();
    const refreshTable = () => {
        actionRef.current?.reloadAndRest?.()
    }
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = `current=${params?.current ?? 1}&pageSize=${params?.pageSize ?? 5}`
                    if (params) {
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange)
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }

                    if (sort && Object.keys(sort)[0]) {
                        if (Object.values(sort)[0] === 'ascend')
                            query += `&sort=${Object.keys(sort)[0]}`
                        else {
                            query += `&sort=-${Object.keys(sort)[0]}`
                        }
                    }
                    else {
                        query += `&sort=-createdAt`
                    }
                    const res = await getUsersAPI(query)
                    const allUsers = await getAllUsersAPI()
                    setUsersData(allUsers.data ?? [])

                    if (res.data) {
                        setMeta(res.data?.meta)
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total || 0
                    }
                }}
                rowKey="_id"
                pagination={{
                    showSizeChanger: true,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    current: meta.current,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} on {total} users</div>) }
                }}
                headerTitle="Users"
                toolBarRender={() => [
                    <Button
                        key="Upload"
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            setOpenUploadModal(true)
                        }}
                        type="primary"
                    >
                        Upload
                    </Button>,
                    <CSVLink data={usersData} filename='users.csv'>
                        <Button
                            key="Upload"
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button >
                    </CSVLink>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenAddUserModal(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,
                ]}

            />
            < DetailUser
                openViewDetailModal={openViewDetailModal}
                setOpenViewDetailModal={setOpenViewDetailModal}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <AddUser
                openAddUser={openAddUserModal}
                setOpenAddUser={setOpenAddUserModal}
                refreshTable={refreshTable}
            />
            <UploadUsers
                openUploadModal={openUploadModal}
                setOpenUploadModal={setOpenUploadModal}
                refreshTable={refreshTable}
            />
            <EditUser
                openEditModal={openEditModal}
                setOpenEditModal={setOpenEditModal}
                dataEdit={dataEdit}
                setDataEdit={setDataEdit}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default TableUser;