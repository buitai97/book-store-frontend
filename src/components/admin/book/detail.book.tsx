import { convertDateToStringUS, convertNumberToVND } from "@/services/helper"
import { PlusOutlined } from "@ant-design/icons"
import { Descriptions, DescriptionsProps, Drawer, GetProp, Upload, UploadFile, UploadProps, Image, Divider } from "antd"
import { useState } from "react"

interface IProps {
    openDetailModal: boolean,
    setOpenDetailModal: (v: boolean) => void
    onClose: () => void
    book: IBookTable | null
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


const DetailBook = (props: IProps) => {
    const { openDetailModal, onClose, setOpenDetailModal, book } = props
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: book?._id
        },
        {
            key: '2',
            label: 'Tittle',
            children: book?.mainText,
        },
        {
            key: '3',
            label: 'Author',
            children: book?.author,
        },
        {
            key: '4',
            label: 'Price',
            children: convertNumberToVND(book?.price ?? 0),
        },
        {
            key: '5',
            label: 'Category',
            children: book?.category,
            span: 2,
        },
        {
            key: '6',
            label: 'Created At',
            children: convertDateToStringUS(book?.createdAt),

        },
        {
            key: '7',
            label: 'Updated At',
            children: convertDateToStringUS(book?.updatedAt),
        },

    ];

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-3',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-4',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
    ]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    return (<>
        <Drawer
            title="Book Detail"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            open={openDetailModal}
            width={"50vw"}

        >

            <Descriptions bordered items={items} column={2} />
            <Divider>Book Pictures</Divider>

            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                disabled
            >
            </Upload>

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

        </Drawer>


    </>)
}

export default DetailBook