import { registerAPI } from "@/services/api";
import { App, Button, Form, FormProps, Input, Modal } from "antd";
import { useState } from "react";


type FieldType = {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
};

interface IProps {
    openAddUser: boolean;
    setOpenAddUser: (v: boolean) => void
    refreshTable: () => void;
}
const AddUser = (props: IProps) => {

    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp()
    const { openAddUser, setOpenAddUser, refreshTable } = props
    const [form] = Form.useForm()
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {


        if (values.email && values.fullName && values.password && values.phone) {
            setIsSubmit(true)
            const res = await registerAPI(values.fullName, values.password, values.email, values.phone)
            if (res && res.data) {
                message.success('Add User Successfully!');
                form.resetFields()
                setOpenAddUser(false)
                refreshTable()
            }
            else {
                notification.error({
                    message: "Something happened",
                    description: res.message
                })

            }
            setIsSubmit(false)
        }
    }
    return (
        <>
            <Modal
                title="Add User"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openAddUser}
                onCancel={() => {
                    setOpenAddUser(false)
                    form.resetFields()
                }}
                onOk={form.submit}
                confirmLoading={isSubmit}
            >
                <Form name="basic"
                    labelCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >

                    <Form.Item<FieldType>
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item><Form.Item<FieldType>
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AddUser;