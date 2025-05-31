import { updateUserAPI } from "@/services/api"
import { App, Form, FormProps, Input, Modal } from "antd"
import { useEffect, useState } from "react"


type FieldType = {
    email: string,
    phone: string,
    fullName: string
}

interface IProps {
    openEditModal: boolean,
    dataEdit: IUserTable | null,
    setOpenEditModal: (v: boolean) => void,
    setDataEdit: (v: IUserTable | null) => void,
    refreshTable: () => void
}

const EditUser = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const { setOpenEditModal, openEditModal, dataEdit, refreshTable, setDataEdit } = props
    const { message, notification } = App.useApp()
    const [form] = Form.useForm()
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        if (values.fullName && values.phone && dataEdit) {
            const res = updateUserAPI(dataEdit?._id, values.fullName, values.phone)

            if (res && (await res).data) {
                message.success("Update User Successfully!")
                setOpenEditModal(false)
                setDataEdit(null)
                refreshTable()
            }
            else {
                notification.error({
                    message: "Something happened",
                })

            }

        }
        setIsSubmit(false)
    }
    useEffect(() => {
        if (dataEdit) {
            form.setFieldsValue({
                email: dataEdit.email,
                phone: dataEdit.phone,
                fullName: dataEdit.fullName
            })
        }
    }, [dataEdit])
    return (<>
        <Modal
            title="Add User"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={openEditModal}
            onCancel={() => {
                setOpenEditModal(false)
                setDataEdit(null)
                form.resetFields()
            }}
            onOk={form.submit}
            confirmLoading={isSubmit}

        >
            <Form name="basic"
                labelCol={{ span: 24 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                form={form}
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone number' }]}

                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    </>)
}

export default EditUser