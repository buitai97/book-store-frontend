import { useCurrentApp } from "@/components/context/app.context";
import { convertNumberToVND } from "@/services/helper";
import { Button, Divider } from "antd";
import { useEffect, useState } from "react";
import 'styles/order/order.scss'

interface IProps {
    next: () => void
    totalPrice: number
}

const OrderSummary = (props: IProps) => {
    const { next, totalPrice } = props
    const { cart } = useCurrentApp()


    return (
        <div>
            <h3>Summary</h3>
            <Divider />
            <div className="subtotal">
                <div>Tax</div>
                <div>{convertNumberToVND(0)}</div>

            </div>
            <div className="subtotal">
                <div>Subtotal</div>
                <div>{convertNumberToVND(totalPrice)}</div>
            </div>
            <Divider />
            <div className="total">
                <div>Total</div>
                <div className="cost">{convertNumberToVND(totalPrice)}</div>
            </div>
            <Divider />

            <Button color="danger" variant="solid" block onClick={next}>Check Out</Button>
        </div>
    )
}

export default OrderSummary 