import { createBookAPI, getBookCategoriesAPI, uploadFileAPI } from "@/services/api";
import { PlusOutlined } from "@ant-design/icons";
import { FormProps, Col, Form, GetProp, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps, Image, message } from "antd"
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type FieldType = {
    mainText: string,
    author: string,
    price: number,
    category: string,
    quantity: number,
    fileListThumbnail: UploadFile[],
    fileListSlider: UploadFile[]
}

interface IProps {
    setOpenCreateModal: (v: boolean) => void,
    openCreateModal: boolean,
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const CreateBookModal = (props: IProps) => {
    const { openCreateModal, setOpenCreateModal } = props

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [categories, setCategories] = useState<string[]>([])

    const [form] = Form.useForm()

    const handleThumbNailUploadChange: UploadProps['onChange'] = ({ fileList }) => {
        setFileListThumbnail(fileList)
        form.setFieldsValue({ fileListThumbnail: fileList })
    }

    const handleSliderUploadChange: UploadProps['onChange'] = ({ fileList }) => {
        setFileListSlider(fileList);
        form.setFieldsValue({ fileListSlider: fileList })
    }
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);

        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng || Upload.LIST_IGNORE
    };

    const handleCancel = () => {
        setOpenCreateModal(false);
        setFileListSlider([])
        setFileListThumbnail([])
        form.resetFields()
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { author, category, fileListSlider, fileListThumbnail, mainText, price, quantity } = values
        const thumbnail = fileListThumbnail?.[0]?.name ?? ""
        const slider = fileListSlider?.map(item => item.name) ?? []
        const res = await createBookAPI(
            thumbnail,
            slider,
            mainText,
            author,
            price,
            quantity,
            category
        )
        if (res && res.data) {
            console.log(res)
        } else { console.log(res.error) }
    }

    const handleRemove = async (file: UploadFile, type: "thumbnail" | "slider") => {
        if (type === 'thumbnail') {
            setFileListThumbnail([])
        }
        if (type === "slider") {
            setFileListSlider(fileListSlider.filter(x => x.uid !== file.uid));
        }
    }

    const handleUploadFile = async (options: RcCustomRequestOptions, type: "thumbnail" | 'slider') => {
        const { onSuccess } = options
        const file = options.file as UploadFile
        const res = await uploadFileAPI(file, "book")
        if (res && res.data) {

            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }])
            }
            else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }])
            }
            if (onSuccess)
                onSuccess("ok")
        }
        else {
            message.error(res.message)
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const getCategoriesRes = await getBookCategoriesAPI()
            setCategories(getCategoriesRes.data ?? [])
        }
        fetchCategories()
    }, [])
    return (

        <>
            <Modal
                title="Add new book"
                open={openCreateModal}
                onOk={form.submit}
                onCancel={handleCancel}
                destroyOnClose={true}
                width={"50vw"}
                okText={"Add Book"}

            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<FieldType> label="Book Title" name="mainText" rules={[{ required: true, message: 'Please enter book title!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType> label="Author" name="author" rules={[{ required: true, message: 'Please enter author' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item<FieldType> label="Price" name="price" required>
                                <InputNumber addonAfter="VND" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType> label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}
                            >
                                <Select
                                    style={{ width: 120 }}
                                    options={categories.map((category) => { return { value: category, label: category } })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType> label="Quantity" name="quantity" rules={[{ required: true, message: 'Please choose quantity!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Upload Thumbnail"
                                name="fileListThumbnail"
                                valuePropName="fileList"

                            >
                                <Upload
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    onChange={handleThumbNailUploadChange}
                                    beforeUpload={beforeUpload}
                                    multiple={false}
                                    maxCount={1}
                                    fileList={fileListThumbnail}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    onRemove={(file) => { handleRemove(file, 'thumbnail') }}
                                >
                                    {uploadButton}
                                </Upload>

                            </Form.Item>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}

                                />
                            )}
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Upload Slider"
                                name="fileListSlider"
                                valuePropName="file"
                            >
                                <Upload
                                    listType="picture-card"
                                    onChange={handleSliderUploadChange}
                                    fileList={fileListSlider}
                                    onPreview={handlePreview}
                                    beforeUpload={beforeUpload}
                                    customRequest={(options) => handleUploadFile(options, "slider")}

                                >
                                    {uploadButton}
                                </Upload>

                            </Form.Item>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}

                                />
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default CreateBookModal