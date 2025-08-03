import { App, Button, Divider, Form, Input } from "antd"
import type { FormProps } from 'antd';
import { Typography } from 'antd';
import { useState } from "react";
import { registerAPI } from "@/services/api";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp()
    const navigate = useNavigate()
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values.email && values.fullName && values.password && values.phone) {
            setIsSubmit(true)
            const res = await registerAPI(values.fullName, values.password, values.email, values.phone)
            if (res && res.data) {
                message.success('Registered Successfully!');
                navigate("/login")
            }
            else {
                setIsSubmit(false)
                message.error(res.message)
            }
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Form
            className="form-container"
            name="basic"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 400, padding: 20 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
        >
            <Typography.Title level={2} style={{ textAlign: 'center' }}>
                Register
            </Typography.Title>
            <Divider />
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
                rules={[{ required: true, message: 'Please input your email!' }, { type: "email", message: "Not a valid email!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label={null}>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Submit
                </Button>
            </Form.Item>
            <Divider> OR </Divider>
            <div className="text text-normal" style={{ textAlign: "center" }}>Already registered? <Link to="/login">Login</Link></div>
        </Form>
    )
}

export default RegisterPage