import { deleteBookAPI, getBooksAPI } from "@/services/api";
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CreateBookModal from "./create.book";
import DetailBook from "./detail.book";
import { convertNumberToVND } from "@/services/helper";
import UpdateBook from "./update.book";

type TSearch = {
    title: string,
    author: string
}


const TableBook = () => {
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [selectedBook, setSelectedBook] = useState<IBookTable | null>(null)
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([])

    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false)
    const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false)
    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <Link to="#" onClick={() => {
                            setSelectedBook(entity)
                            setOpenDetailModal(true)
                        }}>{entity._id}</Link>
                    </>
                )
            },
        },
        {
            title: 'Book Title',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
            sorter: true
        },
        {
            title: 'Author',
            dataIndex: 'author',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (convertNumberToVND(entity.price))
            },
        },
        {
            title: 'Last Update',
            dataIndex: 'updatedAt',
            valueType: "date",
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Action',
            key: 'action',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => (
                <Space>
                    <EditOutlined
                        style={{ color: 'orange', cursor: "pointer", marginRight: "10px" }}
                        onClick={() => {
                            setSelectedBook(entity)
                            setOpenUpdateModal(true)
                        }}>
                    </EditOutlined>

                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this book?"
                        onConfirm={async () => {
                            const res = await deleteBookAPI(entity._id)
                            if (res && res.data) {
                                console.log(res.data)
                                refreshTable()
                            } else {
                                console.log(res.error)
                            }
                        }}
                        okType="danger"
                        okText="Delete"
                        okButtonProps={{}}
                        cancelText="Cancel"
                    >
                        <DeleteOutlined
                            style={{ color: 'red', cursor: "pointer" }}
                        ></DeleteOutlined>
                    </Popconfirm>

                </Space>
            )
        }
    ];

    const tableRef = useRef<ActionType>()
    const refreshTable = () => {
        tableRef.current?.reloadAndRest?.();
    }

    return (
        <>
            <ProTable<IBookTable, TSearch>

                headerTitle="Book Table"
                actionRef={tableRef}
                rowKey={'_id'}
                columns={columns}
                cardBordered
                request={async (params, sort, filter) => {

                    let query = `current=${params.current}&pageSize=${params.pageSize ?? 5}`

                    if (sort && Object.keys(sort)[0]) {
                        if (Object.values(sort)[0] === 'ascend')
                            query += `&sort=${Object.keys(sort)[0]}`
                        else {
                            query += `&sort=-${Object.keys(sort)[0]}`
                        }
                    }
                    else {
                        query += `&sort=-updatedAt`
                    }
                    const res = await getBooksAPI(query)
                    if (res.data) {
                        setCurrentDataTable(res.data.result)
                    }
                    if (res.data) setMeta(res.data?.meta)
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total || 0
                    }


                }}
                pagination={
                    {
                        total: meta.total,
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50, 100]
                    }
                }
                toolBarRender={() => [
                    <CSVLink data={currentDataTable} filename="book.csv">
                        <Button type="primary" icon={<ExportOutlined />}>Export</Button >
                    </CSVLink>,
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setOpenCreateModal(true)
                    }}>Add Book</Button>
                ]}
            />

            < CreateBookModal
                setOpenCreateModal={setOpenCreateModal}
                openCreateModal={openCreateModal}
                refreshTable={refreshTable}
            />

            <DetailBook
                openDetailModal={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                book={selectedBook}
                setOpenDetailModal={setOpenDetailModal}
            />

            <UpdateBook
                openUpdateModal={openUpdateModal}
                setOpenUpdateModal={setOpenUpdateModal}
                book={selectedBook}
                setSelectedBook={setSelectedBook}
                refreshTable={refreshTable}
            />
        </>
    )


}
export default TableBook;