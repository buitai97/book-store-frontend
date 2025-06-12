import { useEffect, useState } from 'react';
import { Col, Form, Input, InputNumber, Modal, Image, Row, Select, Upload, UploadFile, GetProp, UploadProps, message, FormProps } from 'antd';
import { UploadRequestOption } from "rc-upload/lib/interface";
import { getBookCategoriesAPI, updateBookAPI, uploadFileAPI } from '@/services/api';
import { DefaultOptionType } from 'antd/es/select';
import { PlusOutlined } from '@ant-design/icons';
import { v4 } from 'uuid'
interface IProps {
    openUpdateModal: boolean,
    setOpenUpdateModal: (v: boolean) => void,
    book: IBookTable | null,
    setSelectedBook: (v: IBookTable | null) => void,
    refreshTable: () => void
}

type FieldType = {
    author: string,
    mainText: string,
    price: number,
    category: string,
    quantity: number,
    thumbnail: UploadFile[],
    slider: UploadFile[]
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];


const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })


const UpdateBook = (props: IProps) => {
    const { book, openUpdateModal, setOpenUpdateModal, setSelectedBook, refreshTable } = props
    const [categories, setCategories] = useState<DefaultOptionType[]>([])
    const [form] = Form.useForm()
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState("")

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([])
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([])

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string))
        setPreviewOpen(true)
    }

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng || isLt2M || Upload.LIST_IGNORE;
    }

    const handleCancel = () => {
        setOpenUpdateModal(false)
        setSelectedBook(null)
        form.resetFields()
    }

    const handleRemove = (
        file: UploadFile,
        type: "thumbnail" | "slider"
    ) => {
        if (type === "thumbnail") {
            setFileListThumbnail([])
        }
        else {
            setFileListSlider(fileListSlider.filter((x) => x.uid !== file.uid))
        }
    }

    const handleUploadFile = async (
        options: UploadRequestOption,
        type: "thumbnail" | "slider"
    ) => {
        const { onSuccess } = options
        const file = options.file as UploadFile
        const res = await uploadFileAPI(file, "book");
        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded
                    }`,
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else {
                setFileListSlider((prevState) => {
                    const updated = [...prevState, { ...uploadedFile }];
                    return updated
                })
            }
            if (onSuccess) onSuccess("ok")
            else {
                message.error(res.message)
            }
        }
    }

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmitting(true)
        const { author, category, mainText, price, quantity } = values
        const id = book?._id ?? ""
        const res = await updateBookAPI(
            id,
            fileListThumbnail?.[0].name,
            fileListSlider.map((file) => file.name),
            mainText,
            author,
            price,
            quantity,
            category
        )
        if (res && res.data) {
            console.log(res);
        } else {
            console.log(res.message);
        }

        setIsSubmitting(false)
        setOpenUpdateModal(false);
        refreshTable()
    }
    useEffect(() => {
        // Assign initial form values 
        if (book) {
            const thumbnail: UploadFile[] = [{ uid: v4(), name: book.thumbnail, status: 'done', url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}` }]
            const slider: UploadFile[] = book.slider.map((img) => {
                return {
                    uid: v4(),
                    name: img,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${img}`
                }
            })
            setFileListThumbnail(thumbnail)
            setFileListSlider(slider)
            form.setFieldsValue({
                mainText: book.mainText,
                author: book.author,
                price: book.price,
                category: book.category,
                quantity: book.quantity,
                thumbnail: thumbnail,
                slider: slider,
            })


        }
        const fetchCategories = async () => {
            const getCategoriesRes = await getBookCategoriesAPI();
            setCategories(getCategoriesRes?.data?.map((category) => { return { value: category, label: category } }) ?? []);
        };
        fetchCategories();
    }, [book])

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    )
    return (
        <>
            <Modal
                title="Update Book"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openUpdateModal}
                okText={"Update Book"}
                onOk={form.submit}
                onCancel={handleCancel}
                width={"50vw"}
                confirmLoading={isSubmitting}
            >
                <Form
                    autoComplete='off'
                    layout='vertical'
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Book Title"
                                name="mainText"
                                rules={[{ required: true, message: "Please enter book title!" }]
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: "Please enter author" }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={6} style={{ minWidth: "210px" }}>
                            <Form.Item<FieldType> label="Price" name="price" required>
                                <InputNumber
                                    addonAfter="VND"
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: "Please select a category" }]}>
                                <Select
                                    style={{ width: 120 }}
                                    options={categories}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: "Please enter quantity!" }]}
                            >
                                <InputNumber
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Upload Thumbnail"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                name="thumbnail"
                                rules={[{ required: true, message: "Please upload slider!" }]}
                            >
                                <Upload
                                    maxCount={1}
                                    multiple={false}
                                    listType='picture-card'
                                    onPreview={handlePreview}
                                    beforeUpload={beforeUpload}
                                    onRemove={(file) => handleRemove(file, "thumbnail")}
                                    customRequest={(options) => handleUploadFile(options, "thumbnail")}
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: "none" }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) =>
                                            !visible && setPreviewImage(""),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Upload Slider"
                                name="slider" valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[{ required: true, message: "Please upload slider!" }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    beforeUpload={beforeUpload}
                                    onRemove={(file) => handleRemove(file, "slider")}
                                    customRequest={(options) => handleUploadFile(options, "slider")}
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: "none" }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) =>
                                            !visible && setPreviewImage(""),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal >
        </>
    );
};

export default UpdateBook;