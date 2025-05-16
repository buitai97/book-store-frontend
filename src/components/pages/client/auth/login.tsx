import { loginAPI } from "@/services/api";
import { Button, Checkbox, Form, Input, Typography, Divider, App } from "antd"
import type { FormProps } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import { useCurrentApp } from "@/components/context/app.context";
type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};




const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const { message, notification } = App.useApp()
    const { setCurrentUser, setIsAuthenticated } = useCurrentApp()
    const navigate = useNavigate()


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values.email && values.password) {
            setIsSubmit(true)
            const res = await loginAPI(values.email, values.password)
            if (res && res.data) {
                setCurrentUser(res.data.user)
                setIsAuthenticated(true)
                localStorage.setItem('access_token', res.data.access_token)
                message.success("Login successfully!")
                navigate("/")
            }
            else {
                notification.error({
                    message: "Error",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                })
                setIsSubmit(false)
            }
        }


    };


    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div>
                <Form
                    className="form-container"
                    name="basic"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 24 }}
                    style={{ minWidth: 300, maxWidth: 400, padding: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Typography.Title level={2} style={{ textAlign: 'center' }}>
                        Login
                    </Typography.Title>
                    <Divider />
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
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

                    <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Login
                        </Button>
                    </Form.Item>
                    <Divider>OR</Divider>
                    <div style={{ textAlign: "center" }}><Link to="/register">Create new account</Link></div>
                </Form>
            </div>
        </>
    )
}


export default LoginPage