import OrderDelivery from "@/components/client/order/order.delivery";
import OrderSummary from "@/components/client/order/order.summary";
import { useCurrentApp } from "@/components/context/app.context";
import { Button, Empty, Result, Steps } from "antd";
import OrderDetail from "components/client/order/order.detail";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'styles/order/order.scss'


const OrderPage = () => {
    const [current, setCurrent] = useState(0);

    const [totalPrice, setTotalPrice] = useState(0)

    const { cart } = useCurrentApp()
    useEffect(() => {
        if (cart && cart.length > 0) {
            let sum = 0;
            cart.map(item => {
                sum += item.quantity * item.detail.price
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0)
        }
    }, [cart])

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Order Detail',
            content: <OrderSummary next={next} totalPrice={totalPrice} />,
        },
        {
            title: 'Delivery',
            content: <OrderDelivery next={next} totalPrice={totalPrice} />,
        },
        {
            title: 'Completed',
            content: <Result
                status="success"
                title="Order Placed Successfully!"
                subTitle="We have received your order"
                extra={[
                    <Button type="primary" key="home">
                        <Link to="/">
                            Home
                        </Link>
                    </Button>,
                    <Button key="history">Order History</Button>
                ]}
            />,
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }))
    return (
        <div>
            <Steps style={{ padding: "20px" }} current={current} items={items} />
            {
                current == 1 ? <a onClick={prev} style={{ display: "flex", justifyContent: "flex-end", marginRight: "20px" }}> &lt;	Return</a>
                    : null
            }


            {cart.length == 0 && current < 2 ?
                <Empty description={
                    "Your cart is empty"
                } />
                :
                <div>

                    <div className="order-page">

                        <OrderDetail current={current} />
                        <div className="right">{steps[current].content}</div>
                    </div>
                </div>

            }
        </div>

    )
}

export default OrderPage;