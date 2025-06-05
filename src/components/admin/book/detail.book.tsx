import { convertDateToStringUS, convertNumberToVND } from "@/services/helper"
import { Descriptions, DescriptionsProps, Drawer, Image, Divider } from "antd"
import { useEffect, useState } from "react"


const BOOK_IMG_URL = `${import.meta.env.VITE_BACKEND_URL}`
interface IProps {
    openDetailModal: boolean,
    setOpenDetailModal: (v: boolean) => void
    onClose: () => void
    book: IBookTable | null
}


const DetailBook = (props: IProps) => {
    const { openDetailModal, onClose, setOpenDetailModal, book } = props
    const [imgList, setImgList] = useState<string[]>([])
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

    useEffect(() => {
        if (book) {
            setImgList([book?.thumbnail, ...book?.slider])
        }
    }, [book])

    return (
        <>

            <Drawer
                title="Book Detail"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailModal}
                width={"50vw"}

            >

                <Descriptions bordered items={items} column={2} />
                <Divider>Book Pictures</Divider>

                <Image.PreviewGroup
                >
                    {imgList.map((image, index) => (
                        <Image
                            key={index}
                            width={100}
                            wrapperStyle={{
                                border: '1px solid #eaeaea',
                                borderRadius: 4,
                                padding: 4,
                                margin: 4
                            }}
                            src={`${BOOK_IMG_URL}/images/book/${image}`}
                        />))}

                </Image.PreviewGroup>

            </Drawer>


        </>)
}

export default DetailBook