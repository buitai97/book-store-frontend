import { useCurrentApp } from "@/components/context/app.context"
import { updateUserPasswordAPI } from "@/services/api"
import { Button, Form, Input, message, notification } from "antd"
import { FormProps } from "antd/lib"
import { useEffect } from "react"

type FieldType = {
    email2: string,
    oldPassword: string,
    newPassword: string
}

const UpdatePassword = () => {
    const { user, setUser } = useCurrentApp()
    const [form] = Form.useForm()

    useEffect(() => {
        if (user) {
            form.setFieldsValue({ email2: user?.email })
        }
    }, [])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        const { email2, oldPassword, newPassword } = values
        const res = await updateUserPasswordAPI(email2, oldPassword, newPassword)
        if (res && res.data) {
            message.success("Password updated!")
            localStorage.removeItem('access_token')
        } else {
            notification.error({
                message: "something happened",
                description: res.message
            })
        }
    }
    return (
        <>
            <Form autoComplete="off" layout="vertical" wrapperCol={{ span: 12 }} onFinish={onFinish} form={form}>
                <Form.Item label="Email" name="email2" required>
                    <Input disabled />
                </Form.Item>

                <Form.Item label="Old Password" name="oldPassword" required>
                    <Input.Password autoComplete="new-password" />
                </Form.Item>

                <Form.Item label="New Password" name="newPassword" required>
                    <Input.Password autoComplete="new-password" />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Update
                </Button>
            </Form>
        </>
    )
}

export default UpdatePassword