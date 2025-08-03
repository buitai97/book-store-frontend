import { useCurrentApp } from "@/components/context/app.context"
import { createOrderAPI } from "@/services/api";
import { convertNumberToVND } from "@/services/helper"
import { Button, Divider, Form, Input, Radio } from "antd"
import { FormProps } from "antd/lib";
import { useState } from "react";


type FieldType = {
    name: string;
    phone: string;
    address: string;
    method: string;

};

interface IProps {
    totalPrice: number
    next: () => void
}
const OrderDelivery = (props: IProps) => {
    const { totalPrice, next } = props
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { user } = useCurrentApp()
    const initialValues = {
        name: user?.fullName,
        phone: user?.phone,
        method: "COD"
    }
    const { cart, setCart } = useCurrentApp()
    const booksOrder = cart.map((item) => {
        return {
            bookName: item.detail.mainText,
            quantity: item.quantity,
            _id: item._id
        }
    })

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmitting(true)
        const res = await createOrderAPI(
            values.name, values.address, values.phone, totalPrice, values.method, booksOrder
        )
        if (res && res.data) {
            next()
        }
        setCart([])
        localStorage.removeItem('cart')
        setIsSubmitting(false)
    }

    return (
        <div>
            <Form<FieldType> initialValues={initialValues} onFinish={handlePlaceOrder}>
                <h3>Delivery Details</h3>
                <Divider />
                <Form.Item name="method" labelCol={{ span: 24 }} label="Payment Method" >
                    <Radio.Group>
                        <Radio value="Bank">Bank Transfer</Radio>
                        <Radio value="COD">Cash On Delivery</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item labelCol={{ span: 24 }} label="Name" name="name" rules={[{ required: true, message: 'Please enter name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Phone Number" name="phone" labelCol={{ span: 24 }} rules={[{ required: true, message: 'Please enter phone number!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Address" name="address" labelCol={{ span: 24 }} rules={[{ required: true, message: 'Please enter Address!' }]}>
                    <Input />
                </Form.Item>
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

                <Form.Item>
                    <Button color="danger" htmlType="submit" variant="solid" loading={isSubmitting} block>Place Order</Button>
                </Form.Item>
            </Form>


        </div>
    )
}


export default OrderDelivery