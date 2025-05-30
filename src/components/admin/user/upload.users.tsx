import { createUsersBulkAPI } from "@/services/api";
import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, notification, Table, TableProps, UploadProps } from "antd";
import Password from "antd/es/input/Password";
import Dragger from "antd/es/upload/Dragger";
import Excel from "exceljs"
import { useState } from "react";
interface IProps {
    openUploadModal: boolean;
    setOpenUploadModal: (v: boolean) => void
    refreshTable: () => void
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const columns: TableProps<IDataImport>['columns'] = [
    {
        title: 'Full Name',
        dataIndex: 'fullName',
    }, {
        title: 'Email',
        dataIndex: 'email',
    }, {
        title: 'Phone',
        dataIndex: 'phone',
    }

];

const UploadUsers = (props: IProps) => {
    const [importedData, setimportedData] = useState<IDataImport[]>([])
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const { message, notification } = App.useApp()
    const { openUploadModal, setOpenUploadModal, refreshTable } = props
    const handleImport = async () => {
        setIsSubmit(true)
        const dataSubmit = importedData.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await createUsersBulkAPI(dataSubmit)
        setimportedData([])
        setOpenUploadModal(false)
        setIsSubmit(false)
        notification.success({
            message: "message",
            description: <>
                <div>Added: {res.data?.countSuccess}</div>
                <div>Error: {res.data?.countError}</div>
            </>
        })
        refreshTable()
    }
    const draggerProps: UploadProps = {
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        name: 'file',
        multiple: false,
        maxCount: 1,
        async customRequest({ file, onSuccess }) {

            if (onSuccess) {
                onSuccess("ok")
            };
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!

                    //load file to buffer
                    const workbook = new Excel.Workbook()
                    const arrayBuffer = await file.arrayBuffer()
                    await workbook.xlsx.load(arrayBuffer)

                    //convert file to json
                    let jsonData: IDataImport[] = []
                    workbook.worksheets.forEach(function (sheet) {
                        let firstRow = sheet.getRow(1)
                        if (!firstRow.cellCount) return

                        let keys = firstRow.values as any[]

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return
                            let values = row.values as any
                            let obj: any = {}
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i]
                            }
                            jsonData.push(obj)
                        })
                    })
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setimportedData(jsonData)
                }

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            } else if (status === 'removed') {
                setimportedData([])
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return (<>

        <Modal
            title="Upload data users"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={openUploadModal}
            onOk={handleImport}
            onCancel={() => {
                setOpenUploadModal(false)
                setimportedData([])
            }}
            okText="Import Data"
            okButtonProps={{
                disabled: importedData.length > 0 ? false : true,
                loading: isSubmit
            }}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single file upload. Only accept .csv, .xls, .xlsx
                </p>
            </Dragger>
            <div style={{ margin: 10 }}> Data uploaded: </div>
            <Table<IDataImport>
                rowKey="id"
                columns={columns}
                dataSource={importedData}
            />
        </Modal >
    </>)
}

export default UploadUsers;