import { Col, Row } from "antd";

const OrderPage = () => {
    return (
        <Row className="order-page">
            <Col span={16} className="left">left</Col>
            <Col span={8} className="right">right</Col>
        </Row>
    )
}

export default OrderPage;