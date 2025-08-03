import { InputNumber, Typography } from "antd";
import "styles/order/order.scss"
import { DeleteOutlined } from "@ant-design/icons";
import { useCurrentApp } from "@/components/context/app.context";
import { convertNumberToVND } from "@/services/helper";
import { useState } from "react";

interface IProps {
    current: number
}

const { Text } = Typography;

const OrderDetail = (props: IProps) => {
    const { cart, setCart } = useCurrentApp()
    const [ellipsis, setEllipsis] = useState(true);
    const { current } = props

    const handleQuantityChange = (value: number, book: ICartItem) => {
        if (!value || +value < 1) return
        if (!isNaN(+value)) {
            const cartStorage = localStorage.getItem("cart")
            if (cartStorage && book) {
                const cart = JSON.parse(cartStorage) as ICartItem[]

                let isExistIndex = cart.findIndex(c => c._id === book?._id)
                if (isExistIndex > -1) {
                    cart[isExistIndex].quantity = +value
                }
                localStorage.setItem("cart", JSON.stringify(cart))

                setCart(cart)
            }
        }
    }
    const handleRemoveItem = (id: string) => {
        const cartStorage = localStorage.getItem("cart")
        if (cartStorage && id) {
            const cart = JSON.parse(cartStorage) as ICartItem[]
            let isExistIndex = cart.findIndex(item => item._id === id)
            if (isExistIndex > -1) {
                cart.splice(isExistIndex, 1)
            }
            localStorage.setItem("cart", JSON.stringify(cart))

            setCart(cart)
        }
    }



    return current < 2 ? (
        <div className="left">
            {cart.map((book) => {
                const currentBookPrice = book?.detail?.price ?? 0;
                return (<div className="item">
                    <img className="card__image" src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.detail.thumbnail}`} alt="card item" />
                    <span className="title">
                        <Text
                            style={ellipsis ? { width: 300 } : undefined}
                            ellipsis={ellipsis ? { tooltip: 'I am ellipsis now!' } : false}
                        >
                            {book.detail.mainText}
                        </Text>
                    </span>
                    <span className="price">{convertNumberToVND(book.detail.price)}</span>
                    <InputNumber
                        onChange={(value) => { handleQuantityChange(value as number, book) }}
                        className="quantity-input"
                        min={1}
                        value={book.quantity}
                        disabled={current > 0}
                    />
                    <span className="subtotal">{
                        convertNumberToVND(currentBookPrice * book.quantity)
                    }</span>
                    <DeleteOutlined
                        className="delete-button"
                        style={{ display: current > 0 ? 'none' : "block" }}
                        onClick={() => handleRemoveItem(book._id)}
                    />
                </div>)
            })}
        </div >
    )
        : null
}

export default OrderDetail;