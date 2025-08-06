import { useCurrentApp } from "@/components/context/app.context"
import { updateUserAPI, uploadFileAPI } from "@/services/api"
import { UploadOutlined } from "@ant-design/icons"
import { Row, Col, Avatar, Upload, message, Button, Input, Form, notification, GetProp } from "antd"
import { FormProps } from "antd/es/form"
import { UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload"
import { useEffect, useState } from "react"
import { UploadRequestOption } from "rc-upload/lib/interface";

type FieldType = {
    _id: string
    email: string
    fullName: string
    phone: string
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];


const UpdateInformation = () => {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { user, setUser } = useCurrentApp()
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "")
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`
    const [form] = Form.useForm()
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        return isJpgOrPng || Upload.LIST_IGNORE;
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                _id: user.id,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName
            })
        }
    })

    const handleUploadFile = async (options: UploadRequestOption) => {
        const { onSuccess } = options
        const file = options.file as UploadFile
        const res = await uploadFileAPI(file, "avatar")

        if (res && res.data) {
            const newAvatar = res.data?.fileUploaded
            setUserAvatar(newAvatar)
            if (onSuccess)
                onSuccess('ok')
        } else {
            message.error(res.message)
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, phone, _id } = values
        setIsSubmitting(true)
        const res = await updateUserAPI(_id, userAvatar, fullName, phone)

        if (res && res.data) {
            setUser({
                ...user!,
                avatar: userAvatar,
                fullName,
                phone
            })
            message.success("Update user successfully!")
            localStorage.removeItem("access_token")
        } else {
            console.log(res)
            notification.error({
                message: "Something happened!",
                description: res.message

            })
        }
    }
    return (
        <Row>
            <Col span={12}>
                <div>
                    <Avatar style={{ width: "50%", height: "50%" }} src={urlAvatar} />
                </div>
                <Upload
                    maxCount={1}
                    beforeUpload={beforeUpload}
                    multiple={false}
                    showUploadList={false}
                    customRequest={handleUploadFile}
                    onChange={(info: UploadChangeParam) => {
                        if (info.file.status !== 'uploading') { }
                        if (info.file.status === 'done') {
                            message.success("File Uploaded")
                        } else if (info.file.status === 'error') {
                            message.error("Can not upload file")
                        }
                    }}
                >
                    <Button icon={<UploadOutlined />} > Upload Avatar</Button>
                </Upload>
            </Col>
            <Col span={12}>
                <Form<FieldType> labelCol={{ span: 24 }} form={form} onFinish={onFinish}>
                    <Form.Item name="_id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" initialValue={user?.email} name="email" required>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Name" initialValue={user?.fullName} name="fullName" required>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Phone" initialValue={user?.phone} name="phone" required>
                        <Input />
                    </Form.Item>
                    <Button htmlType="submit" >
                        Update
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}

export default UpdateInformation