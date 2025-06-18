import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Form, InputNumber, Rate, Row } from "antd"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import ImageGallery from "react-image-gallery";
import "./book.detail.scss"
import { convertNumberToVND } from "@/services/helper";
import { BsCartPlus } from "react-icons/bs";
import ModalGallery from "./Modal.Gallery";
const images = [
    {
        original: "https://picsum.photos/id/1018/1000/600/",
        thumbnail: "https://picsum.photos/id/1018/250/150/",
    },
    {
        original: "https://picsum.photos/id/1015/1000/600/",
        thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
        original: "https://picsum.photos/id/1019/1000/600/",
        thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
];
const BookDetail = () => {
    let { id } = useParams()

    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>()

    const refGallery = useRef<ImageGallery>(null)
    useEffect(() => {
        if (id) {
            console.log("id: ", id)
        }
    })

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true)
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }
    return (
        <div style={{ padding: "20px" }}>
            <div className="detail-book" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col xs={0} sm={0} md={10}>
                            <ImageGallery
                                ref={refGallery}
                                items={images}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                slideOnThumbnailOver={true}
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    showThumbnails={false}
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col span={24}>
                                <div className="author">Author:<a> JoHemmings</a></div>
                                <div className="title"> How Psychology Worked</div>
                                <div className="rating">
                                    <Rate value={5} disabled style={{ fontSize: 14 }}></Rate>
                                </div>
                                <div className="price">{convertNumberToVND(600000)}</div>
                                <div>
                                    <span className="left">Delivery</span>
                                    <span className="right">Free Delivery</span>
                                </div>
                                <div className="quantity">
                                    <span className="left">Quantity</span>
                                    <span className="right">
                                        <button className="control"><MinusOutlined /></button>
                                        <input defaultValue={1} />
                                        <button className="control"><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className="buy">
                                    <button className="cart">
                                        <BsCartPlus className="icon-cart" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button className="now">Buy Now</button>
                                </div>
                            </Col>


                        </Col>
                    </Row >
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex ?? 1}
                title={"hardcode"}
                items={images}
            />
        </div>

    )
}

export default BookDetail;