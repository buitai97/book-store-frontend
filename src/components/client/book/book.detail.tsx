import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Col, message, Rate, Row } from "antd"
import { ChangeEvent, useRef, useState } from "react"
import ImageGallery from "react-image-gallery";
import "./book.detail.scss"
import { convertNumberToVND } from "@/services/helper";
import { BsCartPlus } from "react-icons/bs";
import ModalGallery from "./modal.gallery";
import { useCurrentApp } from "components/context/app.context"
interface IProps {
    currentBook: IBookTable | null
}
const BookDetail = (props: IProps) => {
    const { currentBook } = props
    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>()
    const [quantity, setQuantity] = useState<number>(1)
    const refGallery = useRef<ImageGallery>(null)
    const { cart, setCart } = useCurrentApp()

    const slider = currentBook?.slider?.map((url) => ({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${url}`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${url}`,
        originalClass: 'original-image',
        thumbnailClass: 'thumbnail-image'
    })) ?? []

    const thumbnail = {
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook?.thumbnail}`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook?.thumbnail}`,
        originalClass: 'original-image',
        thumbnailClass: 'thumbnail-image'
    }

    const images = [thumbnail, ...slider]

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true)
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }
    const handleDecreaseQuantity = () => {
        setQuantity((prev) => prev > 1 ? prev -= 1 : prev)
    }
    const handleIncreaseQuantity = () => {
        if (quantity < currentBook?.quantity!) {
            setQuantity((prev) => prev += 1)
        }
    }
    const handleQuantityInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputNumber = +e.target?.value
        if (!isNaN(+inputNumber)) {
            if (+inputNumber > 0 && currentBook && +inputNumber <= currentBook.quantity) {
                setQuantity(+inputNumber)
            }
        }
    }

    const handleAddToCart = () => {
        const cartStorage = localStorage.getItem("cart")
        let currentCart: ICartItem[] = []
        if (cartStorage && currentBook) {
            currentCart = JSON.parse(cartStorage)
            let isExistIndex = currentCart.findIndex(c => c._id === currentBook._id)
            if (isExistIndex > -1) {

                currentCart[isExistIndex].quantity += + quantity
            } else {
                currentCart.push({
                    quantity: quantity,
                    _id: currentBook._id,
                    detail: currentBook,
                })
            }

        } else {
            currentCart = [{
                _id: currentBook?._id!,
                quantity: quantity!,
                detail: currentBook!
            }]

        }
        localStorage.setItem("cart", JSON.stringify(currentCart))
        setCart(currentCart)
        console.log(currentCart)
        message.success("Added item to cart successfully!")
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
                                <div className="author">Author:<a> {currentBook?.author}</a></div>
                                <div className="title"> {currentBook?.mainText}</div>
                                <div className="rating">
                                    <Rate value={5} disabled style={{ fontSize: 14 }} />
                                    <span> {currentBook?.sold} Sold</span>
                                </div>
                                <div className="price">{convertNumberToVND(currentBook?.price ?? 0)}</div>
                                <div>
                                    <span className="left">Delivery</span>
                                    <span className="right">Free Delivery</span>
                                </div>
                                <div className="quantity">
                                    <span className="left">Quantity</span>
                                    <span className="right">
                                        <button className="control" onClick={handleDecreaseQuantity}><MinusOutlined /></button>
                                        <input value={quantity} onChange={(e) => handleQuantityInputChange(e)} />
                                        <button className="control" onClick={handleIncreaseQuantity}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className="buy">
                                    <button className="cart" onClick={handleAddToCart} style={{ cursor: "pointer" }}>
                                        <BsCartPlus className="icon-cart" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button className="now" style={{ cursor: "pointer" }}>Buy Now</button>
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
                title={currentBook?.mainText ?? ""}
                items={images}
            />
        </div >

    )
}

export default BookDetail;